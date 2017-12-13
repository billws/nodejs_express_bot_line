const botRules = {
    GetRule: function(text){
        let rule = "";
        switch(text){
            case process.env.SS:
                rule = "SS";
                break;
            case process.env.NN:
                rule = "NN";
                break;
            default:
                break;
        }
        return rule;
    },
    SS: function(client, event){
        console.log(event);

        // create a echoing text message
        const echo = { type: 'text', text: event.message.text };
      
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    }
}

module.exports = botRules;