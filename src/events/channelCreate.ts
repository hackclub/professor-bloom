import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

type ChannelCreateEvent = Middleware<
  SlackEventMiddlewareArgs<"channel_created">
>;

export const channelCreateEvent: ChannelCreateEvent = async ({
  event,
  client,
}) => {
  try {
    await client.conversations.join({ channel: event.channel.id });
  } catch (e) {
    console.error(e);
  }
};
