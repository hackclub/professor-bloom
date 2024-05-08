import { lchannel } from "../index";

export const mirrorMessage = async ({
  message,
  user,
  channel,
  type,
  client,
}): Promise<void> => {
  try {
    const context = `a ${type} from <@${user}> in <#${channel}>`;

    await client.chat.postMessage({
      channel: lchannel,
      text: context,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `> ${message}`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: context,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};
