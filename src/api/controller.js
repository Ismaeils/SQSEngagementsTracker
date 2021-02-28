const SqsService = require('../services/sqs-service');
const DatagenService = require('../services/datagen-service');
const {infoLogger, errorLogger} = require('../config/logger');
const {modifyConversation, newProgressBar} = require('./utils');
const urls = require('../config/urls.json');
const dateFormat = require("dateformat");
const splitArray = require('split-array');

async function getInitialData(){
    return (await DatagenService.fetchGeneratedConversations(urls.generatedConversationsUrl)
        .catch(e=> errorLogger.log({message: e, level: 'error'})));
}

async function pushInitialConversations(){
    //Getting initial generated conversations 
    DatagenService.fetchedConversations = await getInitialData();
    //For Debugging
    console.log('Pushing initial conversations to InitialQueue');
    let progressBar = newProgressBar();
    progressBar.start(DatagenService.fetchedConversations.length, 0);
    for(let conversation of DatagenService.fetchedConversations){
        let params = {
            MessageBody: JSON.stringify(conversation),
            QueueUrl: urls.initialQueue,
            DelaySeconds: 0
        };

        let receipt = await SqsService.pushConversation(params).catch(e=> {
            errorLogger.log({message: e, level: 'error'});
        });

        SqsService.initialReceipts.push(receipt);

        progressBar.increment();
    };

    progressBar.stop();

    return SqsService.initialReceipts;
}

async function consumeConversations(){
    let queueCheckParams = {QueueUrl: urls.initialQueue, AttributeNames: ['ApproximateNumberOfMessages']};
    let totalConversations = await SqsService.getRemainingConversations(queueCheckParams).catch(e=> {
        errorLogger.log({message: e, level: 'error'});
    });
    let remainingConversations = totalConversations;

    //For Debugging
    console.log('Consuming conversations from InitialQueue');
    let progressBar = newProgressBar();
    progressBar.start(totalConversations, 0);

    while(remainingConversations > 0){

        let consumingParams = {
            QueueUrl: urls.initialQueue,
            VisibilityTimeout: 80
        };

        let conversation = await SqsService.consumeConversation(consumingParams)
            .catch(e=> errorLogger.log({message: e, level: 'error'}));
        
        if(conversation) {
            conversation = JSON.parse(conversation);
            conversation.timestamp = dateFormat(new Date(), "dd, mm, yyyy, h:MM:ss TT");
            SqsService.consumedConversations.push(conversation);
            progressBar.increment();
        }

        remainingConversations = await SqsService.getRemainingConversations(queueCheckParams)
            .catch(e=> errorLogger.log({message: e, level: 'error'}));
        
    }
    progressBar.stop();
    return SqsService.consumedConversations;
}

async function processConversations(){
    //For Debugging
    console.log('Processing the consumed conversations');
    let progressBar = newProgressBar();
    progressBar.start(SqsService.consumedConversations.length, 0);

    for(conversation of SqsService.consumedConversations){
        conversation = modifyConversation(conversation);
        SqsService.processedConversations.push(conversation);
        SqsService.totalEngagements = SqsService.totalEngagements + conversation.total_engagements;

        let average = (SqsService.totalEngagements / SqsService.processedConversations.length);
        infoLogger.log({
            message: `-> ${conversation.timestamp} -> ${average}`,
            level: 'info'
        });
        progressBar.increment();
    }

    progressBar.stop();

    return SqsService.processedConversations;
}

async function pushConversations(){

    let preparedBatches = splitArray(SqsService.processedConversations, 10);
        let pushingParams = {
            QueueUrl: urls.outputQueue,
            Entries: []
        }

        //For Debugging
        console.log('Pushing prcoessed conversations to OutputQueue');
        let progressBar = newProgressBar();
        progressBar.start(preparedBatches.length, 0);

        for(let batch of preparedBatches){
            pushingParams.Entries = [];
            for(let conversation of batch){
                pushingParams.Entries.push({
                    Id: conversation.id,
                    MessageBody: JSON.stringify(conversation)
                });
            }
            let result = await SqsService.pushConversations(pushingParams)
                .catch(e=> errorLogger.log({message: e, level: 'error'}));

            SqsService.receipts.push(result);
            progressBar.increment();
        }
        progressBar.stop();

        return SqsService.receipts;

}

module.exports.pushInitialConversations = pushInitialConversations;
module.exports.pushConversations = pushConversations;
module.exports.consumeConversations = consumeConversations;
module.exports.processConversations = processConversations;
module.exports.getInitialData = getInitialData;