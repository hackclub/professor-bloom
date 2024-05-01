import { torielReq } from "../types/toriel";
import { transcript } from "./transcript";

let channel;

if (process.env.NODE_ENV === "production") {
  channel = transcript("channels.welcome-committee");
} else {
  channel = transcript("channels.welcomebotsuperdev");
}

export const sendWelcomeMsg = async (client: any, data: torielReq) => {
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
              type: "plain_text",
              text: "Lemme welcome them!",
              emoji: true,
            },
            value: "id",
            action_id: "approve",
            style: "primary",
          },
        ],
      },
    ],
  });
};
