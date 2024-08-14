import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function openEditModal(
  client: any,
  triggerId: string,
  userName: string,
  text: string | undefined,
): Promise<void> {
  await client.views.open({
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "edit_prompt",
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
          block_id: "edit_input_block",
          element: {
            type: "plain_text_input",
            multiline: true,
            initial_value: text,
            action_id: "edit_input-action",
          },
          label: {
            type: "plain_text",
            text: `<@${userName}>'s template`,
            emoji: true,
          },
        },
      ],
    },
  });
}

export const handleEditTemplate = async ({ ack, body, client }) => {
  try {
    await ack();
  } catch (error) {
    console.error("Error acknowledging request:", error);
    return;
  }

  const transcript = await prisma.user.findUnique({
    where: {
      slack: body.user.id,
    },
    select: {
      transcript: true,
    },
  });
  await openEditModal(
    client,
    body.trigger_id,
    body.user.id,
    transcript?.transcript,
  );
};
