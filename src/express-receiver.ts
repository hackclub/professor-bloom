import { ExpressReceiver } from "@slack/bolt";
import { ConsoleLogger, LogLevel } from '@slack/logger';
import { PrismaClient } from '@prisma/client';
import { PrismaInstallationStore } from '@seratch_/bolt-prisma';

const logger = new ConsoleLogger();
logger.setLevel(LogLevel.DEBUG);

const prismaClient = new PrismaClient({ log: [{ emit: 'stdout', level: 'query' }] });
const installationStore = new PrismaInstallationStore({
  prismaTable: prismaClient.slackToken,
  clientId: process.env.SLACK_CLIENT_ID,
  logger,
});
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-secret',
  scopes: [
    "app_mentions:read",
    "calls:read",
    "canvases:read",
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
    "metadata.message:read",
    "reactions:read",
    "reactions:write",
    "users.profile:read",
    "users:read",
    "users:read.email",
    "users:write"
  ],
  installerOptions: {
    directInstall: true,
    userScopes: ['chat:write'],
  },
  installationStore,
  logger,
});

export { receiver };
