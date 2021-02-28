const {pushConversations, 
    pushInitialConversations, 
    processConversations, 
    consumeConversations} = require('./controller');

module.exports = function(app){

    app.get('/push-initial', async (req, res) => {
    
        //Push conversations to InitialQueue at random intervals
        let receipts = await pushInitialConversations();
    
        res.send(receipts);
    });
    
    app.get('/consume', async (req, res) => {
    
        //Consume conversations from InitialQueue, Returns list of consumed conversations
        let conversations = await consumeConversations();
    
        res.send(conversations);
    });
    
    app.get('/process', async (req, res) => {
    
        //Modify consumed conversations and log the average, Returns list of enriched conversations
        let modifiedConversations = await processConversations();
    
        res.send(modifiedConversations);
    });
    
    app.get('/push', async (req, res) => {
    
        //Push processed conversations to OutputQueue, Returns receipts of pushed conversation batches
        let receipts = await pushConversations();
    
        res.send(receipts);
    
    });

}
