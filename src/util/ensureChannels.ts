import type { App } from "@slack/bolt";
import colors from "colors";
import { transcript } from "../lib/transcript";

export async function ensureChannels(app: App): Promise<void> {
  const data = await app.client.users.conversations();
  const currentChannelIDs = data.channels!.map((c) => c.id);
  const channels = [
    transcript("channels.welcome-bot-dev"),
    transcript("channels.welcome"),
    transcript("channels.welcome-committee"),
    transcript("channels.welcomebot-log"),
    transcript("channels.welcomebotsuperdev"),
    transcript("channels.welcomebotsuperdev-log")
  ];

  let missingChannels: string[] = [];
  channels.forEach((testID) => {
    let found = currentChannelIDs.indexOf(testID) > -1;
    if (!found) {
      missingChannels.push(testID);
    }
  });

  if (missingChannels.length === 0) {
    console.log(
      colors.green("The Professor is in all channels he should have access to"),
    );
  } else {
    console.warn(
      colors.yellow.bold.underline(
        "⚠️ The Professor is not invited to these channels:" + missingChannels,
      ),
    );
  }
}
