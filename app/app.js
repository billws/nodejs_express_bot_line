var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: process.env.ChannelId || "",
  channelSecret: process.env.ChannelSecret || "",
  channelAccessToken: process.env.ChannelAccessToken || ""
});

bot.on('message', function(event) {
    console.log(event); 
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var userId = event.source.userId;
      event.reply(msg).then(function(data) {
        // success 
        console.log(msg);
        setTimeout(function(){
            var sendMsg = "Test...";
            bot.push(userId, sendMsg);
            console.log('userID: ' + userId);
            console.log('send: ' + sendMsg);
        }, 10000);
      }).catch(function(error) {
        // error 
        console.log('error');
      });
    }
});

  
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
  
//https://stackoverflow.com/questions/18008620/node-js-express-js-app-only-works-on-port-3000
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});