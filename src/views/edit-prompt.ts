import { App } from "@slack/bolt";
import * as fs from "fs/promises";
import * as path from "path";

const editPrompt = async (app: App): Promise<void> => {
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
      } else {
        throw new Error("No valid text value found.");
      }
    } catch (error) {
      console.error("Error:", error);
      await client.chat.postEphemeral({
        channel: channel_id,
        user: user_id,
        text: "An error occurred while processing your request.",
      });
    }
  });
};

export default editPrompt;
