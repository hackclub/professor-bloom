import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openReportAdultModal = async (
  client,
  trigger_id: string,
  userId: string,
  messageTs: string,
) => {
  return await client.views.open({
    trigger_id,
    view: {
      title: {
        type: "plain_text",
        text: "Report Adult",
        emoji: true,
      },
      type: "modal",
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true,
      },
      callback_id: "report_adult",
      submit: {
        type: "plain_text",
        text: "Report",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          block_id: "report_adult_block",
          text: {
            type: "mrkdwn",
            text: `*Reporting <@${userId}>*`,
          },
        },
        {
          type: "input",
          block_id: "adult_reason",
          element: {
            type: "plain_text_input",
            multiline: true,
            action_id: "report_adult-action",
          },
          label: {
            type: "plain_text",
            text: "Why do you think they're an adult?",
          },
        },
        {
          type: "input",
          block_id: "communicated",
          element: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an option",
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Yes",
                },
                value: "yes",
              },
              {
                text: {
                  type: "plain_text",
                  text: "No",
                },
                value: "no",
              },
            ],
            action_id: "communicated-action",
          },
          label: {
            type: "plain_text",
            text: "Have you confirmed in DMs with them?",
          },
        },
      ],
      private_metadata: `${userId}:${messageTs}:wlc`,
    },
  });
};

export const handleReportAdult = async ({ ack, body, client, action }) => {
  try {
    await ack();
  } catch (error) {
    console.error("Error acknowledging request:", error);
    return;
  }

  const userSlackId = (body.actions[0].value as string) || "";
  console.log(`User: ${userSlackId}`);

  const now = new Date();

  const welcomeEvent = await prisma.welcomeEvent.findFirst({
    where: { newUserId: userSlackId },
  });
  if (!welcomeEvent) {
    // This shouldn't happen, but if it does let's ignore it 🤫
    return;
  }
  const timeToWelcome = now.getTime() - welcomeEvent.joinedAt.getTime();

  await prisma.welcomeEvent.update({
    where: { id: welcomeEvent.id },
    data: {
      status: "completed",
      timeToWelcome,
      completedAt: now,
      adult: true,
      welcomerId: body.user.id,
    },
  });

  await openReportAdultModal(
    client,
    body.trigger_id,
    userSlackId,
    body.message.ts,
  );
};
