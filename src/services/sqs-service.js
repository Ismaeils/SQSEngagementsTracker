const aws = require('aws-sdk');
const {waitRandom} = require('../api/utils');
class SqsService{
    constructor(){
        aws.config.loadFromPath(process.cwd() + '\\src\\config\\sqs-config.json');
        this.sqs = new aws.SQS({apiVersion: '2012-11-05'});
        this.initialConversations = [];
        this.consumedConversations = [];
        this.processedConversations = [];
        this.receipts = [];
        this.initialReceipts = [];
        this.totalEngagements = 0;
    }
    
    //Gets the number of available messages
    getRemainingConversations = async (params)=> {
        let res = await this.sqs.getQueueAttributes(params).promise();
        return (parseInt(res.Attributes.ApproximateNumberOfMessages));
    }

    //Pushes message to queue at random interval.
    pushConversation = async  (params)=> {
        waitRandom();
        return (await this.sqs.sendMessage(params).promise());

    }
    
    //Pushes messages batch to queue at random interval.
    pushConversations = async (params) => { 
        waitRandom();
        return (await this.sqs.sendMessageBatch(params).promise());
    }
    
    //Consumes messages from queue at random interval.
    consumeConversation = async (params)=>{ 
    
        //waitRandom();
        let result = await this.sqs.receiveMessage(params).promise();
    
        if(result.Messages) return(result.Messages[0].Body);
    }


}

module.exports = new SqsService();