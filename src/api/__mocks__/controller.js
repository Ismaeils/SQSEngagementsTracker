const conversationSample = {"id":"6036dc062637bab6bfe190c0",
    "organization_id":"601a6fc90638651eff8350a8",
    "type":"post",
    "source":"facebook",
    "link":"https://facebook.com/fake-post",
    "username":"faker fake",
    "engagements":{"likes":103,"love":3,"haha":115,"angry":70}
};


module.exports.pushInitialConversations = async ()=>{
    let fetched = await Promise.resolve([conversationSample, conversationSample, conversationSample, conversationSample]);
    let receipts = [];
    for (let index = 1; index <= fetched.length; index++) {
        receipts.push(await Promise.resolve({receipt_id: index}));
    }
    return receipts;
}

module.exports.consumeConversations = async ()=>{
    let totalConversations = await Promise.resolve(4);
    let remainingConversations = totalConversations;
    let conversations = [];
    while(remainingConversations > 0){
        let conversation = await Promise.resolve(JSON.stringify(conversationSample));
        conversation = JSON.parse(conversation);
        conversation.timestamp = 'sample-date';
        conversations.push(conversation);
        remainingConversations = remainingConversations - 1;
    }
    return conversations;
}

module.exports.processConversations = ()=>{
    let processedConversations = [];
    let totalConversations = 0;
    let totalEngs = 0;
    for(let conversation of [conversationSample,conversationSample,conversationSample,conversationSample]){
        totalConversations = totalConversations + 1;
        conversation.total_engagements = 0;
        for(var engagement in conversation.engagements){
            conversation.total_engagements = conversation.total_engagements + parseInt(conversation.engagements[engagement]);
        }
        totalEngs = totalEngs + conversation.total_engagements;
        conversation.average = totalEngs / totalConversations;

        processedConversations.push(conversation);
    }
    return processedConversations;
}

module.exports.pushConversations = async ()=>{
    let preparedBatches = [[conversationSample,conversationSample,conversationSample,conversationSample]];
    let receipts = [];
    for(let index = 1; index <= preparedBatches.length; index++){
        receipts.push(await Promise.resolve({receipt_id: index}));
    }
    return receipts;
}