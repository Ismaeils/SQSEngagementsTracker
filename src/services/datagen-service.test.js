const DatagenService = require('./datagen-service');

const conversationSample = {"id":"6036dc062637bab6bfe190c0",
    "organization_id":"601a6fc90638651eff8350a8",
    "type":"Mock Type",
    "source":"Mock Source",
    "link":"Mock Link",
    "username":"Mock Username",
    "engagements":{"likes":103,"love":3,"haha":115,"angry":70}};

jest.mock('axios', ()=>({
    __esModule: true,
    default: {
        get: jest.fn().mockResolvedValue({data: [conversationSample, conversationSample, conversationSample, conversationSample]})
    }
}));


describe('DatagenService', ()=>{
    it('should return a list of generated json objects(conversations)', async ()=>{
        let listOfConvos = await DatagenService.fetchGeneratedConversations("url");
        expect(listOfConvos).toStrictEqual([conversationSample, conversationSample, conversationSample, conversationSample]);
    });
});

