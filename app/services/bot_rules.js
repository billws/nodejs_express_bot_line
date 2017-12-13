const dbServices = require('./dbServices');

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
            case process.env.INIT_DB:
                rule = "InitDB";
                break;
            default:
                break;
        }
        return rule;
    },
    SS: function(client, event){
        console.log(event);
        
        let text = dbServices.AttendDrawing("Test", event.source.userId, 2017, 0);
        console.log(text);
        text = text == "Done" ? "報名完成": "報名失敗";
        // create a echoing text message
        const echo = { type: 'text', text: text };
      
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    },
    NN: function(client, event){
        console.log(event);

        // create a echoing text message
        const echo = { type: 'text', text: 'init' };
                
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    },
    InitDB: function(){
        dbServices.InitDB();
    }
}

module.exports = botRules;