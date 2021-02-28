const cliProgress = require('cli-progress');

function waitRandom() { // A blocking version of setTimeOut for testing purposes.
    const date = Date.now();
    let now = null;
    do {
        now = Date.now();
    } while (now - date < Math.round(Math.random() * (3000 - 500)) + 500);
}

function modifyConversation(conversation){
    conversation.total_engagements = 0;
    for(var engagement in conversation.engagements){
        conversation.total_engagements = conversation.total_engagements + parseInt(conversation.engagements[engagement]);
    };
    return conversation;
}

function newProgressBar(){
    return new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
}

module.exports.modifyConversation = modifyConversation;
module.exports.waitRandom = waitRandom;
module.exports.newProgressBar = newProgressBar;
