"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorMessage = void 0;
const index_1 = require("../index");
const mirrorMessage = async ({ message, user, channel, type, client, }) => {
    try {
        const context = `a ${type} from <@${user}> in <#${channel}>`;
        await client.chat.postMessage({
            channel: index_1.lchannel,
            text: context,
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `> ${message}`,
                    },
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: context,
                        },
                    ],
                },
            ],
        });
    }
    catch (error) {
        console.error(error);
    }
};
exports.mirrorMessage = mirrorMessage;
//# sourceMappingURL=mirrorMessage.js.map