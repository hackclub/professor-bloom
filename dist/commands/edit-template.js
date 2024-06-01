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
const editTemplate = async (app) => {
    app.command("/edit-template", async ({ command, ack, body, client, respond }) => {
        await ack();
        const { user_id, user_name, channel_id } = command;
        const filePath = path.resolve(__dirname, `../../templates/${user_name}`);
        // Perform access control here
        // For you Jasper: if (!isUserAllowed(user_id)) { await respond(`Unauthorized!`); return; }
        try {
            if (await fileExists(filePath)) {
                const text = await readFileContent(filePath);
                await openEditModal(client, channel_id, body.trigger_id, user_name, text);
            }
            else {
                await respond(`File does not exist! Use \`/add-template <text>\` to create a new template.`);
            }
        }
        catch (error) {
            console.error("Error:", error);
            await respond(`An error occurred while processing your request.`);
        }
    });
};
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch (error) {
        return false;
    }
}
async function readFileContent(filePath) {
    const text = await fs.readFile(filePath, "utf-8");
    return text;
}
async function openEditModal(client, channel_id, triggerId, userName, text) {
    await client.views.open({
        trigger_id: triggerId,
        view: {
            type: "modal",
            callback_id: "edit_prompt",
            private_metadata: channel_id,
            submit: {
                type: "plain_text",
                text: "Submit",
                emoji: true,
            },
            title: {
                type: "plain_text",
                text: `Editing ✏️`,
            },
            blocks: [
                {
                    type: "input",
                    element: {
                        type: "plain_text_input",
                        multiline: true,
                        initial_value: text,
                        action_id: "edit_input-action",
                    },
                    label: {
                        type: "plain_text",
                        text: `${userName}'s template`,
                        emoji: true,
                    },
                },
            ],
        },
    });
}
exports.default = editTemplate;
//# sourceMappingURL=edit-template.js.map