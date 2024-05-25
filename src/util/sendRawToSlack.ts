import { getLogChannel } from "../func/getLogChannel";

export const sendRawToSlack = async (client: any, data: any) => {
  const logChannel = await getLogChannel();

  await client.chat.postMessage({
    channel: logChannel,
    text: data,
  });
};
