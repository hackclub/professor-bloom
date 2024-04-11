import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";

import { app } from "./app";
import * as events from "./events/index";
import { receiver } from "./express-receiver";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);

const channels = {
  dev: process.env.CHANNEL_welcome_bot_dev,
  welcome: process.env.CHANNEL_welcome,
  welcomeCommittee: process.env.CHANNEL_welcome_committee,
  logging: process.env.CHANNEL_welcomebot_log,
  superDev: process.env.CHANNEL_welcomebotsuperdev,
  superDevLog: process.env.CHANNEL_welcomebotsuperdev_log,
  log: "",
};

app.event("message", async (args) => {
  // begin the firehose
  // TODO: Log any actions regarding Prof Bloom, to bloom log
});

(async (): Promise<void> => {
  await app.start(Number(process.env.PORT) || 3000);
  console.log(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`);

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
