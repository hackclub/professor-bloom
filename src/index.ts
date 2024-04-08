import { App } from "@slack/bolt";
import * as dotenv from "dotenv";
dotenv.config();

import * as events from "./events/index";

// const node_environment = process.env.NODE_ENV;

const channels = {
  dev: process.env.CHANNEL_welcome_bot_dev,
  welcome: process.env.CHANNEL_welcome,
  welcomeCommittee: process.env.CHANNEL_welcome_committee,
  logging: process.env.CHANNEL_welcomebot_log,
  superDev: process.env.CHANNEL_welcomebotsuperdev,
  superDevLog: process.env.CHANNEL_welcomebotsuperdev_log,
  log: "",
};

if (process.env.NODE_ENV === "development") {
  console.log("Welcome bot running in development mode");
  channels.log = channels.superDevLog!;
} else {
  console.log("Welcome bot running in production mode");
  channels.log = channels.logging!;
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // socketMode: false,
});

(async (): Promise<void> => {
  await app.start(Number(process.env.PORT) || 3000);
  console.log("⚡️ Bolt app is running!");

  console.log(channels);

  app.client.chat.postMessage({
    channel: `${channels.superDevLog!}`,
    text: `Professor Bloom enters, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
  });

  for (const [event, handler] of Object.entries(events)) {
    handler(app);
    console.log(`Loaded event: ${event}`);
  }
})();
