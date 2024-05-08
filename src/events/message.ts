import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

type MessageEvent = Middleware<SlackEventMiddlewareArgs<"message">>;

export const messageEvent: MessageEvent = async ({ message, client }) => {
  // set text to message.text
  const text = message.subtype;
  console.log(text);
  // if (
  //   text?.toLowerCase()?.includes("professorbloom" || "professor bloom") ||
  //   text?.includes(transcript("selfUserID"))
  // ) {
  //   mirrorMessage({
  //     message: text,
  //     user,
  //     channel,
  //     lchannel,
  //     type,
  //     client,
  //   });
  // }
  // const { text, user, channel, type } = event;
  // if (
  //   text?.toLowerCase()?.includes("professorbloom" || "professor bloom") ||
  //   text?.includes(transcript("selfUserID"))
  // ) {
  //   mirrorMessage({
  //     message: text,
  //     user,
  //     channel,
  //     lchannel,
  //     type,
  //     client,
  //   });
  // }
  // check for specific channel
  // console.log(message);
  // console.log(message.channel);
  // console.log(message.channel);
  // console.log(transcript("channels.jasper"));
  // if (message.channel === transcript("channels.jasper")) {
  //   console.log(message.text);
  // }
  // if (event.channel === transcript("channels.jasper")) {
  //   console.log(event);
  // // if message contains "aarya"
  // if (event.text.includes("aarya")) {
  //   await client.chat.postMessage({
  //     channel: event.channel,
  //     text: transcript("aarya"),
  //   });
  // }
  // if message contains "jasper"
  // if (event.text.includes("jasper")) {
  //   await client.chat.postMessage({
  //     channel: event.channel,
  //     text: transcript("jasper"),
  //   });
  // }
  // }
  // });
};
