const dbServices = require('./dbServices');

const botRules = {
    GetRule: function(text){
        let rule = "";
        switch(true){
            case text.endsWith(process.env.SS):
                rule = "SS";
                break;
            case text.endsWith(process.env.CCSS):
                rule = "CCSS";
                break;
            case text.endsWith(process.env.DDSS):
                rule = "DDSS";
                break;
            case text.endsWith(process.env.NN):
                rule = "NN";
                break;
            case text.endsWith(process.env.INIT_DB):
                rule = "InitDB";
                break;
            default:
                break;
        }
        return rule;
    },
    SS: function(client, event){
        let firstIndex = event.message.text.indexOf("我是");
        let lastIndex = event.message.text.indexOf(process.env.SS);
        if(firstIndex === 0 && lastIndex > 0){
            return dbServices.AttendDrawing(client, event.replyToken, event.message.text.slice(firstIndex + 2, lastIndex), event.source.userId, 2017, 0);
        }else{
            const echo = { type: 'text', text: '格式錯誤啦！' };
            return client.replyMessage(event.replyToken, echo);
        }
    },
    CCSS: function(client, event){
        return dbServices.CheckDrawingPlayers(client, event.replyToken, "Test", event.source.userId, 2017, 0);
    },
    DDSS: function(client, event){
        return dbServices.Drawing(client, event, event.source.userId, 2017, 0);
    },
    NN: function(client, event){

        // create a echoing text message
        const echo = { type: 'text', text: 'init' };
                
        // use reply API
        return client.replyMessage(event.replyToken, echo);
    },
    InitDB: function(client, event){
        dbServices.InitDB(client, event);
    }
}

module.exports = botRules;