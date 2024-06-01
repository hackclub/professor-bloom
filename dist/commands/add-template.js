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
const addTemplate = async (app) => {
    app.command("/add-template", async ({ command, ack, respond }) => {
        await ack();
        const { user_id, user_name, text } = command;
        const directoryPath = path.resolve(__dirname, `../../templates`);
        const filePath = path.resolve(__dirname, `../../templates/${user_name}`);
        // Perform access control here
        // For you Jasper: if (!isUserAllowed(user_id)) { await respond(`Unauthorized!`); return; }
        try {
            await fs.access(directoryPath).catch(async () => {
                await fs.mkdir(directoryPath);
            });
            // Check if file already exists
            const fileExists = await fs
                .access(filePath)
                .then(() => true)
                .catch(() => false);
            if (!fileExists) {
                await fs.writeFile(filePath, text);
                await respond(`File created successfully!`);
            }
            else {
                await respond(`File already exists! Use \`/edit-template\` to edit.`);
            }
        }
        catch (error) {
            console.error("Error:", error);
            await respond(`An error occurred while processing your request.`);
        }
    });
};
exports.default = addTemplate;
//# sourceMappingURL=add-template.js.map