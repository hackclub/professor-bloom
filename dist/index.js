"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lchannel = exports.app = exports.receiver = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connect_node_1 = require("@connectrpc/connect-node");
// import { PrismaClient } from "@prisma/client";
const bolt_prisma_1 = require("@seratch_/bolt-prisma");
const bolt_1 = require("@slack/bolt");
const logger_1 = require("@slack/logger");
const colors_1 = __importDefault(require("colors"));
const express_1 = __importDefault(require("express"));
const client_1 = require("../node_modules/.prisma/client");
const health_1 = require("./endpoints/health");
const index_1 = require("./endpoints/index");
const toriel_1 = require("./endpoints/toriel");
const message_1 = require("./events/message");
const actions_1 = require("./lib/actions");
const commands_1 = require("./lib/commands");
const transcript_1 = require("./lib/transcript");
// import { views } from "./views/index";
const logger = new logger_1.ConsoleLogger();
logger.setLevel(logger_1.LogLevel.DEBUG);
const prismaClient = new client_1.PrismaClient({
    log: [{ emit: "stdout", level: "query" }],
});
const installationStore = new bolt_prisma_1.PrismaInstallationStore({
    prismaTable: prismaClient.slackAppInstallation,
    clientId: process.env.SLACK_CLIENT_ID,
    logger,
});
exports.receiver = new bolt_1.ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: process.env.SLACK_STATE_SECRET,
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
        "reactions:read",
        "reactions:write",
        "users.profile:read",
        "users:read",
        "users:read.email",
        "users:write",
        "metadata.message:read",
        "mpim:history",
    ],
    installerOptions: {
        directInstall: true,
        userScopes: [
            "chat:write",
            "im:write",
            "mpim:history",
            "groups:write",
            "channels:write",
        ],
    },
    installationStore,
    logger,
});
exports.receiver.router.use(express_1.default.json());
exports.receiver.router.get("/", index_1.index);
exports.receiver.router.get("/ping", health_1.health);
exports.receiver.router.get("/up", health_1.health);
exports.receiver.router.post("/toriel/newUser", toriel_1.torielNewUser);
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
exports.app = new bolt_1.App({
    // token: process.env.SLACK_BOT_TOKEN!,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    // appToken: process.env.SLACK_APP_TOKEN!,
    // clientId: process.env.SLACK_CLIENT_ID!,
    // clientSecret: process.env.SLACK_CLIENT_SECRET!,
    // stateSecret: process.env.SLACK_STATE_SECRET!,
    receiver: exports.receiver,
});
exports.app.command("/bloom", commands_1.handleCommand);
exports.app.command("/bloom-dev", commands_1.handleCommand);
// app.view("lemmewelcomethem_form", );
exports.app.action("lemmewelcomethem", actions_1.handleLemmeWelcomeThem);
// fixme: why wont this work????
exports.app.event("message", message_1.messageEvent);
// app.event("channel_created", channelCreateEvent);
const slackerTransport = (0, connect_node_1.createConnectTransport)({
    baseUrl: "https://slacker-server-c2519a818fe5.herokuapp.com/",
    httpVersion: "1.1",
});
const channels = {
    dev: (0, transcript_1.transcript)("channels.welcome-bot-dev"),
    welcome: (0, transcript_1.transcript)("channels.welcome"),
    welcomeCommittee: (0, transcript_1.transcript)("channels.welcome-committee"),
    logging: (0, transcript_1.transcript)("channels.welcomebot-log"),
    superDev: (0, transcript_1.transcript)("channels.welcomebotsuperdev"),
    superDevLog: (0, transcript_1.transcript)("channels.welcomebotsuperdev-log"),
    jasper: (0, transcript_1.transcript)("channels.jasper"),
};
let env = process.env.NODE_ENV.toLowerCase();
if (env === "production") {
    env = "beautiful";
    exports.lchannel = channels.logging;
}
else if (env === "development") {
    env = "lush";
    exports.lchannel = channels.superDevLog;
}
else {
    env = "mysterious";
    exports.lchannel = channels.superDevLog;
}
(async () => {
    /* Code for connecting to slacker api
    const client = createPromiseClient(ElizaService, slackerTransport);
    const res = await client.say({ sentence: "I feel happy." });
    const res = await client.updateNotes({
      actionId: "clvsio1e503wj020wrunqku8y",
      note: "testing2",
    });
    console.log(res);
    */
    exports.app.start(process.env.PORT || 3000);
    console.log(colors_1.default.green(`⚡️ Bolt app is running in env ${process.env.NODE_ENV}!`));
    // await ensureChannels(app);
    //FIXME: this is broken
    // await app.client.chat.postMessage({
    //   channel: lchannel,
    //   text: `Professor Bloom enters his ${env} garden, and inspects his garden of flowers. :sunflower: :tulip: :rose: :hibiscus: :blossom: :cherry_blossom:`,
    // });
    // for (const [view, handler] of Object.entries(views)) {
    //   handler(app);
    //   console.log(`Loaded view: ${view}`);
    // }
})();
//# sourceMappingURL=index.js.map