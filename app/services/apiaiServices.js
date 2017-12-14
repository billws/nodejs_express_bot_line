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
                const echo = [{ type: 'text', text: response.result.fulfillment.speech || "我很笨還沒學會怎麼回覆你..." }, 
                {type: 'sticker', packageId: 3, stickerId: 188}];
                return lineClient.replyMessage(lineEvent.replyToken, echo);
            } else {
                const echo = [{ type: 'text', text: response.result.fulfillment.speech || "這..." }, 
                {type: 'sticker', packageId: 3, stickerId: 187}];
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