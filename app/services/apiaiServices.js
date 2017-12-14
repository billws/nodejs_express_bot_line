'use strict';

const apiai = require("apiai");

const apiaiServices = {

    easyRequest: function(lineClient, lineEvent){
        
        let app = apiai(process.env.APIAI_ACCESS_TOKEN, {
            language: 'zh-TW'
        });

        let options = {
            sessionId: lineEvent.source.userId
        };

        let request = app.textRequest(lineEvent.message.text, options);

        request.on('response', function(response) {
            //console.log(response);
            if(typeof response.result !== 'undefined' && response.result){
                const echo = { type: 'text', text: response.result.fulfillment.speech };
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            } else {
                const echo = { type: 'text', text: "啊阿..." };
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            }
        });

        request.on('error', function(error) {
            //console.log(error);
            const echo = { type: 'text', text: "啊阿..." };
            return lineClient.replyMessage(lineEvent.replyToken, echo);
        });

        request.end();
    }

}


module.exports = apiaiServices;