import * as dotenv from "dotenv";
dotenv.config();

import { createConnectTransport } from "@connectrpc/connect-node";
import { PrismaClient } from "@prisma/client";
import { PrismaInstallationStore } from "@seratch_/bolt-prisma";
import { App, ExpressReceiver } from "@slack/bolt";
import { ConsoleLogger, LogLevel } from "@slack/logger";
import colors from "colors";
import express from "express";

import { health } from "./endpoints/health";
import { index } from "./endpoints/index";
import { torielNewUser } from "./endpoints/toriel";
import { messageEvent } from "./events/message";
import { handleLemmeWelcomeThem } from "./lib/actions";
import { handleCommand } from "./lib/commands";
import { transcript } from "./lib/transcript";
// import { views } from "./views/index";

const logger = new ConsoleLogger();
logger.setLevel(LogLevel.DEBUG);

const prismaClient = new PrismaClient({
  log: [{ emit: "stdout", level: "query" }],
});
const installationStore = new PrismaInstallationStore({
  prismaTable: prismaClient.slackToken,
  clientId: process.env.SLACK_CLIENT_ID,
  logger,
});

export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  stateSecret: process.env.SLACK_STATE_SECRET!,
  scopes: [
    "app_mentions:read",
    "channels:history",
    "channels:join",
    "channels:read",
    "chat:write",
    "chat:write.public",
    "commands",
    "emoji:read",
    "groups:history",
    "groups:write",
    "im:history",
    "im:read",
    "im:write", 
    "mpim:history",
  ],
  installerOptions: {
    directInstall: true,
    userScopes: [
      "chat:write",
    ],
  },
  installationStore,
  logger,
});

receiver.router.use(express.json());
receiver.router.get("/", index);
receiver.router.get("/ping", health);
receiver.router.get("/up", health);
receiver.router.post("/toriel/newUser", torielNewUser);
// receiver.router.get("/slack/install", async (req, res) => {
//   await installer.handleInstallPath(req, res, undefined, {
//     scopes: [],
//     userScopes: ["im:write"],
//     // metadata: "some_metadata",
//   });
// });
// receiver.router.get("/slack/oauth_redirect", async (req, res) => {
//   await installer.handleCallback(req, res, {
//     success: (installation, installOptions) => {
//       res.send(
//         "You have successfully given Professor Bloom permissions! Please close this window."
//       );
//     },
//     failure: (error) => {
//       res.send(
//         "Womp Womp! Something went wrong! Please try again or contact Jasper for support."
//       );
//     },
//   });
// });

export const app = new App({
  // token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  // appToken: process.env.SLACK_APP_TOKEN!,
  // clientId: process.env.SLACK_CLIENT_ID!,
  // clientSecret: process.env.SLACK_CLIENT_SECRET!,
  // stateSecret: process.env.SLACK_STATE_SECRET!,
  receiver,
});

app.command("/bloom", handleCommand);
app.command("/bloom-dev", handleCommand);

// app.view("lemmewelcomethem_form", );

app.action("lemmewelcomethem", handleLemmeWelcomeThem);

// fixme: why wont this work????
app.event("message", messageEvent);
// app.event("channel_created", channelCreateEvent);

const slackerTransport = createConnectTransport({
  baseUrl: "https://slacker-server-c2519a818fe5.herokuapp.com/",
  httpVersion: "1.1",
});

const channels = {
  dev: transcript("channels.welcome-bot-dev"),
  welcome: transcript("channels.welcome"),
  welcomeCommittee: transcript("channels.welcome-committee"),
  logging: transcript("channels.welcomebot-log"),
  superDev: transcript("channels.welcomebotsuperdev"),
  superDevLog: transcript("channels.welcomebotsuperdev-log"),
  jasper: transcript("channels.jasper"),
};

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
    colors.green(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`),
  );

  // await ensureChannels(app);
  const prismaInst = await installationStore.fetchInstallation({
    teamId: "teamID",
    enterpriseId: undefined,
    isEnterpriseInstall: false,
    userId: "userID", //
  });
  //FIXME: this is broken
  await app.client.chat.postMessage({
    token: prismaInst.bot?.token,
    channel: lchannel,
    text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
  });

  // for (const [view, handler] of Object.entries(views)) {
  //   handler(app);
  //   console.log(`Loaded view: ${view}`);
  // }
})();
