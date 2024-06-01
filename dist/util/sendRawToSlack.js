"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRawToSlack = void 0;
const getLogChannel_1 = require("../func/getLogChannel");
const sendRawToSlack = async (client, data) => {
    const logChannel = await (0, getLogChannel_1.getLogChannel)();
    await client.chat.postMessage({
        channel: logChannel,
        text: data,
    });
};
exports.sendRawToSlack = sendRawToSlack;
//# sourceMappingURL=sendRawToSlack.js.map