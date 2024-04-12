import { App } from "@slack/bolt";
import * as fs from 'fs/promises';
import * as path from 'path';

const addTemplate = async (app: App): Promise<void> => {
    app.command('/add-template', async ({ command, ack, respond }) => {
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
            const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

            if (!fileExists) {

                await fs.writeFile(filePath, text);
                await respond(`File created successfully!`);
            } else {
                await respond(`File already exists! Use \`/edit-template\` to edit.`);
            }
        } catch (error) {
            console.error("Error:", error);
            await respond(`An error occurred while processing your request.`);
        }
    });
}

export default addTemplate;
