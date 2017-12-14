

const lineServices = {
    sendMessage: function(client, event){
        // create a echoing text message
        const echo = [{ type: 'text', text: '我很笨還沒學會怎麼回覆你！！' }, 
            {type: 'sticker', packageId: 3, stickerId: 188}];
        
        // use reply API
        return client.replyMessage(event.replyToken, echo);
        
    }    
}

module.exports = lineServices;