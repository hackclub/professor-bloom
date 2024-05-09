import { App } from "@slack/bolt";
import * as fs from "fs/promises";
import * as path from "path";

const editTemplate = async (app: App): Promise<void> => {
  app.command(
    "/edit-template",
    async ({ command, ack, body, client, respond }) => {
      await ack();

      const { user_id, user_name, channel_id } = command;
      const filePath = path.resolve(__dirname, `../../templates/${user_name}`);

      // Perform access control here
      // For you Jasper: if (!isUserAllowed(user_id)) { await respond(`Unauthorized!`); return; }

      try {
        if (await fileExists(filePath)) {
          const text = await readFileContent(filePath);
          await openEditModal(
            client,
            channel_id,
            body.trigger_id,
            user_name,
            text,
          );
        } else {
          await respond(
            `File does not exist! Use \`/add-template <text>\` to create a new template.`,
          );
        }
      } catch (error) {
        console.error("Error:", error);
        await respond(`An error occurred while processing your request.`);
      }
    },
  );
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function readFileContent(filePath: string): Promise<string> {
  const text = await fs.readFile(filePath, "utf-8");
  return text;
}

async function openEditModal(
  client: any,
  channel_id: string,
  triggerId: string,
  userName: string,
  text: string,
): Promise<void> {
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

export default editTemplate;
