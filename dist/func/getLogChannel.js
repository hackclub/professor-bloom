"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogChannel = void 0;
const transcript_1 = require("../lib/transcript");
async function getLogChannel() {
    if (process.env.NODE_ENV === "production") {
        // channel = transcript("channels.welcome-committee");
        return "C0730FV6R41";
    }
    else {
        return (0, transcript_1.transcript)("channels.welcomebotsuperdev");
    }
}
exports.getLogChannel = getLogChannel;
//# sourceMappingURL=getLogChannel.js.map