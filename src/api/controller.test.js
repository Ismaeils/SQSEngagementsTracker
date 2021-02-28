const {pushInitialConversations, consumeConversations, processConversations, pushConversations} = require('./controller');

jest.mock('./controller.js');

describe('Controller', ()=>{
    it('should return receipts and to be equaivlent to the conversations pushed', async ()=>{
        let receipts = await pushInitialConversations();
        expect(receipts.length).toBe(4);
    });
    
    it('should return consumed conversations', async ()=>{
        let conversations = await consumeConversations();
        expect(conversations[0].timestamp).toBeDefined();
        expect(conversations.length).toBe(4);
    });
    
    it('should return processed conversations', ()=>{
        let conversations = processConversations();
        expect(conversations[1].average).toBe((conversations[0].total_engagements + conversations[1].total_engagements) / 2);
        expect(conversations.length).toBe(4);
    });
    
    it('should return receipts of pushed conversations', async ()=>{
        let receipts = await pushConversations();
        expect(receipts.length).toBe(1);
    });
});




