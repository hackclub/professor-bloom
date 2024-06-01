"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appMention = async (app) => {
    app.event("app_mention", async ({ event, client }) => {
        try {
            // respond to the message
            await client.chat.postMessage({
                channel: event.channel,
                text: `Hello, <@${event.user}>! :wave:`,
            });
        }
        catch (e) {
            console.error(e);
        }
    });
};
exports.default = appMention;
//# sourceMappingURL=appMention.js.map