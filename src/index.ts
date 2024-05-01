import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

import { app } from "./app";
import { receiver } from "./express-receiver";
import * as views from "./views/index";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { torielNewUser } from "./endpoints/toriel";

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/toriel/newUser", torielNewUser);

const channels = {
  dev: process.env.CHANNEL_welcome_bot_dev,
  welcome: process.env.CHANNEL_welcome,
  welcomeCommittee: process.env.CHANNEL_welcome_committee,
  logging: process.env.CHANNEL_welcomebot_log,
  superDev: process.env.CHANNEL_welcomebotsuperdev,
  superDevLog: process.env.CHANNEL_welcomebotsuperdev_log,
};

app.event("message", async ({ event, client }) => {
  // begin the firehose
  // TODO: Log any actions regarding Prof Bloom, to bloom log
});

(async (): Promise<void> => {
  await app.start(Number(process.env.PORT) || 3000);
  console.log(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`);

  console.log(channels);

  let env = process.env.NODE_ENV!.toLowerCase();
  if (env === "production") {
    env = "beautiful";
  } else if (env === "development") {
    env = "lush";
  } else {
    env = "mysterious";
  }

  app.client.chat.postMessage({
    channel: `${channels.superDevLog!}`,
    text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
  });

  for (const [view, handler] of Object.entries(views)) {
    handler(app);
    console.log(`Loaded view: ${view}`);
  }
})();
