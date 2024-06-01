"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureChannels = void 0;
const colors_1 = __importDefault(require("colors"));
const transcript_1 = require("../lib/transcript");
async function ensureChannels(app) {
    const data = await app.client.users.conversations();
    const currentChannelIDs = data.channels.map((c) => c.id);
    const channels = [
        (0, transcript_1.transcript)("channels.welcome-bot-dev"),
        (0, transcript_1.transcript)("channels.welcome"),
        (0, transcript_1.transcript)("channels.welcome-committee"),
        (0, transcript_1.transcript)("channels.welcomebot-log"),
        (0, transcript_1.transcript)("channels.welcomebotsuperdev"),
        (0, transcript_1.transcript)("channels.welcomebotsuperdev-log"),
        (0, transcript_1.transcript)("channels.jasper"),
    ];
    let missingChannels = [];
    channels.forEach((testID) => {
        let found = currentChannelIDs.indexOf(testID) > -1;
        if (!found) {
            missingChannels.push(testID);
        }
    });
    if (missingChannels.length === 0) {
        console.log(colors_1.default.green("The Professor is in all channels he should have access to"));
    }
    else {
        console.warn(colors_1.default.yellow.bold.underline("⚠️ The Professor is not invited to these channels:" + missingChannels));
    }
}
exports.ensureChannels = ensureChannels;
//# sourceMappingURL=ensureChannels.js.map