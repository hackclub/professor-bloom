import { App } from "@slack/bolt";

import { receiver } from "./express-receiver";

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

const client: any = app.client;
export { app, client };
