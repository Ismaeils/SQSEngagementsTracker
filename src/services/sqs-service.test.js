const aws = require('aws-sdk');
const sqs = new aws.SQS({
    region: 'us-east-1'
  });
const SqsService = require('./sqs-service');

const conversationSample = {"id":"6036dc062637bab6bfe190c0",
    "organization_id":"601a6fc90638651eff8350a8",
    "type":"post",
    "source":"facebook",
    "link":"https://facebook.com/fake-post",
    "username":"faker fake",
    "engagements":{"likes":103,"love":3,"haha":115,"angry":70}};

jest.mock('aws-sdk', ()=>{
    const SQSMocked = {
        sendMessage: jest.fn().mockReturnThis(),
        sendMessageBatch: jest.fn().mockReturnThis(),
        receiveMessage: jest.fn().mockReturnThis(),
        getQueueAttributes: jest.fn().mockReturnThis(),
        promise: jest.fn()
        
      };
      return {
        __esModule: true,
        SQS: jest.fn(() => SQSMocked),
        config: {
            loadFromPath: jest.fn().mockReturnThis()
        }
      };
});

describe('SqsService', ()=>{
    it('should return the (number) of remaining conversations', async ()=>{
        (sqs.getQueueAttributes().promise).mockResolvedValueOnce({Attributes:{ApproximateNumberOfMessages: 100}});
        let result = await SqsService.getRemainingConversations("params");
        expect(result).toBe(100);
    });
    
    it('should return receipt (json object) of pushed conversation', async ()=>{
        (sqs.sendMessage().promise).mockResolvedValueOnce(conversationSample);
        let result = await SqsService.pushConversation("params");
        expect(result).toStrictEqual(conversationSample);
    });
    
    it('should return receipts (list of json objects) of pushed conversations', async ()=>{
        (sqs.sendMessageBatch().promise).mockResolvedValueOnce([conversationSample, conversationSample]);
        let result = await SqsService.pushConversations("params");
        expect(result).toStrictEqual([conversationSample, conversationSample]);
    });
    
    it('should return conversation (list of one json object)', async ()=>{
        (sqs.receiveMessage().promise).mockResolvedValueOnce({Messages: [{Body: conversationSample}]});
        let result = await SqsService.consumeConversation("params");
        expect(result).toStrictEqual(conversationSample);
    });
});
