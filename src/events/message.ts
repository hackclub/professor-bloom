// import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
// import { transcript } from "../lib/transcript";

// type MessageEvent = Middleware<SlackEventMiddlewareArgs<"message">>;

// export const messageEvent: MessageEvent = async ({ message, client }) => {
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
// };
