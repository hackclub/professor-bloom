import { transcript } from "../lib/transcript";

export async function getLogChannel() {
  let channel: string;
  if (process.env.NODE_ENV === "production") {
    // channel = transcript("channels.welcome-committee");
    channel = "C0730FV6R41";
  } else {
    channel = transcript("channels.welcomebotsuperdev");
  }
}
