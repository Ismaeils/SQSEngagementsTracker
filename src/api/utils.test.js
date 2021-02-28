const {modifyConversation} = require('./utils');

const conversationSample = {"id":"6036dc062637bab6bfe190c0",
    "organization_id":"601a6fc90638651eff8350a8",
    "type":"post",
    "source":"facebook",
    "link":"https://facebook.com/fake-post",
    "username":"faker fake",
    "engagements":{"likes":103,"love":3,"haha":115,"angry":70}
};

it('should return a modified conversation', ()=>{
    let modifiedConversation = modifyConversation(conversationSample);
    expect(modifiedConversation.total_engagements).toBe(291);
});