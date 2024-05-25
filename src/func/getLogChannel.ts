import { transcript } from "../lib/transcript";

export async function getLogChannel() {
  if (process.env.NODE_ENV === "production") {
    // channel = transcript("channels.welcome-committee");
    return "C0730FV6R41";
  } else {
    return transcript("channels.welcomebotsuperdev");
  }
}
