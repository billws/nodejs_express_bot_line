var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: process.env.ChannelId || "",
  channelSecret: process.env.ChannelSecret || "",
  channelAccessToken: process.env.ChannelAccessToken || ""
});


bot.on('message', function(event) {
    console.log(event); 
});
  
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
  
//https://stackoverflow.com/questions/18008620/node-js-express-js-app-only-works-on-port-3000
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});