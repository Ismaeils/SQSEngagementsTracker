const axios = require('axios').default;
class DatagenService{
    constructor(){
        this.fetchedConversations = [];
    }
    fetchGeneratedConversations = (url) => axios.get(url).then(res => res.data);
}
module.exports = new DatagenService();
