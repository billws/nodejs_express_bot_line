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

            if(typeof response.result !== 'undefined' && response.result){
                const echo = { type: 'text', text: response.result.fulfillment.speech || "阿..." };
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            } else {
                const echo = { type: 'text', text: '阿阿...' };
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            }
            
        });

        request.on('error', function(error) {
            return Promise.resolve(false);
        });

        request.end();
    }

}


module.exports = apiaiServices;