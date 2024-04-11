import { App } from "@slack/bolt";

import { receiver } from "./express-receiver";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver,
});

const client: any = app.client;
export { app, client };
