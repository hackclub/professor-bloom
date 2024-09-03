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
import { messageEvent } from "./events/message";
import { appMention } from "./events/appMention";
import { handleHomeTab } from "./events/home";
import { teamJoin } from "./events/teamJoin";
import { handleLemmeWelcomeThem } from "./actions/lemmeWelcomeThem";
import { handleEditTemplate } from "./actions/editWelcomeTemplate";
import { handleEditPromptSubmission } from "./views/editPrompt";
import {
  handleAddWelcomer,
  handleAddWelcomerSubmission,
  handleWelcomerActions,
} from "./actions/welcomerManagment";
import { submissionWelcome } from "./views/submissionWelcome";

const createLogger = (): ConsoleLogger => {
  const logger = new ConsoleLogger();
  logger.setLevel(LogLevel.WARN);
  return logger;
};

const createInstallationStore = (
  prismaClient: PrismaClient,
  logger: ConsoleLogger,
): PrismaInstallationStore => {
  return new PrismaInstallationStore({
    prismaTable: prismaClient.slackToken,
    clientId: process.env.SLACK_CLIENT_ID,
    logger,
  });
};

const createReceiver = (
  installationStore: PrismaInstallationStore,
  logger: ConsoleLogger,
): ExpressReceiver => {
  const receiver = new ExpressReceiver({
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
    installerOptions: { directInstall: true, userScopes: ["chat:write"] },
    installationStore,
    logger,
  });

  receiver.router.use(express.json());
  receiver.router.get("/", index);
  receiver.router.get("/ping", health);
  receiver.router.get("/up", health);

  return receiver;
};

const logger = createLogger();
const prismaClient = new PrismaClient({
  log: [{ emit: "stdout", level: "query" }],
});
const installationStore = createInstallationStore(prismaClient, logger);
const receiver = createReceiver(installationStore, logger);

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  receiver,
});

app.action("lemmewelcomethem", handleLemmeWelcomeThem);
app.action("edit_welcome_template", handleEditTemplate);
app.action("add_welcomer", handleAddWelcomer);
app.action("welcomer_actions", handleWelcomerActions);
app.view("add_welcomer_modal", handleAddWelcomerSubmission);
app.view("edit_prompt", handleEditPromptSubmission);

app.event("message", messageEvent);
app.event("app_mention", appMention);
app.event("team_join", teamJoin);
app.event("app_home_opened", handleHomeTab);
app.view("lemmewelcomethem_form", submissionWelcome);

const env = process.env.NODE_ENV!.toLowerCase();

(async (): Promise<void> => {
  await app.start(process.env.PORT || 3000);
  console.log(colors.green(`⚡️ Bolt app is running in env ${env}!`));

  try {
    await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.SLACK_CHANNEL_DEV_SPAM || "None",
      text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
    });
  } catch (error) {
    logger.error("Failed to send startup message:", error);
  }
})();

export { installationStore, app };
