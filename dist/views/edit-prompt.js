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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const editPrompt = async (app) => {
    app.view("edit_prompt", async ({ ack, body, client }) => {
        await ack();
        const { name: user_name, id: user_id } = body.user;
        const channel_id = body.view.private_metadata;
        const values = body.view.state.values;
        const filePath = path.resolve(__dirname, `../../templates/${user_name}`);
        try {
            let text = Object.values(values)
                .map((valueObject) => valueObject[Object.keys(valueObject)[0]].value)
                .filter((value) => value !== null && value !== undefined)[0];
            if (text !== undefined && text !== null) {
                await fs.writeFile(filePath, text.toString());
                await client.chat.postEphemeral({
                    channel: channel_id,
                    user: user_id,
                    text: "File successfully edited!",
                });
            }
            else {
                throw new Error("No valid text value found.");
            }
        }
        catch (error) {
            console.error("Error:", error);
            await client.chat.postEphemeral({
                channel: channel_id,
                user: user_id,
                text: "An error occurred while processing your request.",
            });
        }
    });
};
exports.default = editPrompt;
//# sourceMappingURL=edit-prompt.js.map