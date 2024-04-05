import {App} from '@slack/bolt';
import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

// const node_environment = process.env.NODE_ENV;

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
});

const expressApp = express();

expressApp.get('/', (req, res) => {
  res.send('Hello World!');
});

// when bot is started, send a message to a specific channel

(async () => {
  // start express app
  await expressApp.listen(process.env.PORT || 3000, () => {
    console.log('⚡️ Express server is running!');
  });

  // Start slack app
  await slackApp.start(process.env.SLACK_PORT || 3001).then(() => {
    console.log('⚡️ Bolt app is running!');
    // send a message to a specific channel
    slackApp.client.chat.postMessage({
      channel: 'C06SU9YMC6R',
      text: 'Stapler is staping! :stapler:',
    });
  });
})();
