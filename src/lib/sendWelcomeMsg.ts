import { getLogChannel } from "../func/getLogChannel";
import { torielReq } from "../types/toriel";

export const sendWelcomeMsg = async (client: any, data: torielReq) => {
  const channel = await getLogChannel();

  await client.chat.postMessage({
    channel,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Someone new joined the slack! :partyparrot:",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_See the details below..._",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> *:technologist:  User:* ${data.userId}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> *:earth_americas:  Continent:* ${data.continent}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> *:speech_balloon:  Join Reason:* ${data.joinReason}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "mrkdwn",
              text: "Lemme welcome them!",
              emoji: true,
            },
            value: JSON.stringify(data),
            action_id: "lemmewelcomethem",
            style: "primary",
          },
        ],
      },
    ],
  });

  let ts = null;
  try {
    const result = await client.conversations.history({
      channel: channel,
      limit: 100,
    });

    const botMessages = result.messages?.filter(
      (message: any) => message.bot_id
    );
    if (botMessages && botMessages.length > 0) {
      ts = botMessages[0].ts;
    }
  } catch (error) {
    console.error(`Failed to fetch bot message timestamp: ${error}`);
  }

  const joinReasontoAlert = [
    {
      reason: "trail",
      alert: "A new trailblazer has joined the slack!",
      userId: "U06QK6AG3RD",
    },
  ];

  joinReasontoAlert.map(async (reason) => {
    if (data.joinReason.includes(reason.reason)) {
      await client.chat.postMessage({
        thread_ts: ts,
        channel,
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text: "<@reason.userId> " + reason.alert,
              emoji: true,
            },
          },
        ],
      });
    }
  });
};
