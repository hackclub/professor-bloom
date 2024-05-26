import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

import { createConnectTransport } from "@connectrpc/connect-node";
import colors from "colors";
import express from "express";

import { app } from "./app";
import { receiver } from "./express-receiver";
import { transcript } from "./lib/transcript";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { slackInstall, slackOAuthRedirect } from "./endpoints/slack";
import { torielNewUser } from "./endpoints/toriel";
// import { views } from "./views/index";

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/toriel/newUser", torielNewUser);
receiver.router.get("/slack/install", slackInstall);
receiver.router.get("/slack/oauth_redirect", slackOAuthRedirect);

const channels = {
  dev: transcript("channels.welcome-bot-dev"),
  welcome: transcript("channels.welcome"),
  welcomeCommittee: transcript("channels.welcome-committee"),
  logging: transcript("channels.welcomebot-log"),
  superDev: transcript("channels.welcomebotsuperdev"),
  superDevLog: transcript("channels.welcomebotsuperdev-log"),
  jasper: transcript("channels.jasper"),
};

const slackerTransport = createConnectTransport({
  baseUrl: "https://slacker-server-c2519a818fe5.herokuapp.com/",
  httpVersion: "1.1",
});

let env = process.env.NODE_ENV!.toLowerCase();

export let lchannel;
if (env === "production") {
  env = "beautiful";
  lchannel = channels.logging!;
} else if (env === "development") {
  env = "lush";
  lchannel = channels.superDevLog!;
} else {
  env = "mysterious";
  lchannel = channels.superDevLog!;
}

const prisma = new PrismaClient();

(async (): Promise<void> => {
  /* Code for connecting to slacker api
  const client = createPromiseClient(ElizaService, slackerTransport);
  const res = await client.say({ sentence: "I feel happy." });
  const res = await client.updateNotes({
    actionId: "clvsio1e503wj020wrunqku8y",
    note: "testing2",
  });
  console.log(res);
  */

  app.start(process.env.PORT || 3000);
  console.log(
    colors.green(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`)
  );

  // await ensureChannels(app);

  await app.client.chat.postMessage({
    channel: lchannel,
    text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
  });
  // for (const [view, handler] of Object.entries(views)) {
  //   handler(app);
  //   console.log(`Loaded view: ${view}`);
  // }
})();
