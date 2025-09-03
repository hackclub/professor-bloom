import { BlockAction, InteractiveMessage, MessageShortcut, SlackShortcut, SlackShortcutMiddlewareArgs } from "@slack/bolt";

import { PrismaClient } from "@prisma/client";
import { slackClient } from "../index";
import { WebClient } from "@slack/web-api";
const prisma = new PrismaClient();

export const handleMessageAdultReport = async({ack, body,payload,respond,shortcut}:SlackShortcutMiddlewareArgs<MessageShortcut>) => {
  try {
    await ack();
  } catch (error) {
    console.error("Error acknowledging request:", error);
    return;
  }
  console.log({shortcut,payload})

  const userSlackId = shortcut.message.user;
  if (!userSlackId ) {
    return respond("Couldn't fetch the message author");
  }
  console.log(`User: ${userSlackId}`);


  await openReportAdultModal(
    new WebClient(process.env.SLACK_BOT_TOKEN),
    body.trigger_id,
    userSlackId,
    shortcut.message.ts,
    shortcut.channel.id
    );

}

const openReportAdultModal = async (
  client: WebClient,
  trigger_id: string,
  userId: string,
  messageTs: string,
  channelId: string
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
        
      ],
      private_metadata: `${userId}:${messageTs}:msg:${channelId}`,
    },
  });
};

