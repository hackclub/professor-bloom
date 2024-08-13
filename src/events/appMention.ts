
import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

type MentionEvent = Middleware<SlackEventMiddlewareArgs<"app_mention">>;

export const appMention: MentionEvent = async ({event, client }) => {
  client.chat.postMessage({
    channel: event.channel,
    text: "Hi there!",
  })
};
