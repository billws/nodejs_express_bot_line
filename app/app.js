const line = require('@line/bot-sdk');
const express = require('express');
const botRules = require('./services/bot_rules');

  
// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || "0",
    channelSecret: process.env.CHANNEL_SECRET || "0",
  };
  
  // create LINE SDK client
  const client = new line.Client(config);
  
  // create Express app
  // about Express itself: https://expressjs.com/
  const app = express();
  
  // register a webhook handler with middleware
  // about the middleware, please refer to doc
  app.post('/callback', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((error) => {
          console.log(error);
      });
  });
  
  // event handler
  function handleEvent(event) {
    console.log(event);
    if (event.type !== 'message' || event.message.type !== 'text') {
      // ignore non-text-message event
      return Promise.resolve(null);
    }
    let ruler = new botRules();
    let condition = ruler.GetRule(event.message.text);
    if(condition !== "") {
      return ruler[condition](client, event);
    } else {
      return Promise.resolve(null);
    }
    
  }

  // listen on port
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });