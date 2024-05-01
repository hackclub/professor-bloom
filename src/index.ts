import * as dotenv from "dotenv";
dotenv.config();

import express from "express";

import { app } from "./app";
import { receiver } from "./express-receiver";
import { transcript } from "./lib/transcript";
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
  dev: transcript("channels.welcome-bot-dev"),
  welcome: transcript("channels.welcome"),
  welcomeCommittee: transcript("channels.welcome-committee"),
  logging: transcript("channels.welcomebot-log"),
  superDev: transcript("channels.welcomebotsuperdev"),
  superDevLog: transcript("channels.welcomebotsuperdev-log"),
  jasper: transcript("channels.jasper"),
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
  let logC;

  if (env === "production") {
    env = "beautiful";
    logC = channels.logging!;
  } else if (env === "development") {
    env = "lush";
    logC = channels.superDevLog!;
  } else {
    env = "mysterious";
    logC = channels.superDevLog!;
  }

  app.client.chat.postMessage({
    channel: logC,
    text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
  });

  for (const [view, handler] of Object.entries(views)) {
    handler(app);
    console.log(`Loaded view: ${view}`);
  }
})();
