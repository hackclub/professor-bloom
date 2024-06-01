"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommand = void 0;
const handleCommand = async ({ command, ack, client }) => {
    const { text, user_id, channel_id } = command;
    const args = text.split(" ");
    if (!args[0] || args[0] === "help") {
        ack();
        await client.chat.postMessage({
            channel: channel_id,
            text: "Command list coming soon!",
        });
    }
    if (args[0] === "md") {
        ack();
        // await client.chat.postMessage({
        //   channel: channel_id,
        // });
    }
};
exports.handleCommand = handleCommand;
//# sourceMappingURL=commands.js.map