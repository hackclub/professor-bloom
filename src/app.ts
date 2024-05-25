import { App } from "@slack/bolt";

import { messageEvent } from "./events/message";
import { receiver } from "./express-receiver";
import { handleLemmeWelcomeThem } from "./lib/actions";
import { handleCommand } from "./lib/commands";

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  appToken: process.env.SLACK_APP_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

app.command("/bloom", handleCommand);
app.command("/bloom-dev", handleCommand);

// app.view("lemmewelcomethem_form", );

app.action("lemmewelcomethem", handleLemmeWelcomeThem);

// fixme: why wont this work????
app.event("message", messageEvent);
// app.event("channel_created", channelCreateEvent);

export const client: any = app.client;
