import Airtable from "airtable";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { WebClient } from "@slack/web-api";
import { app } from "src";
import { User } from "@slack/web-api/dist/response/UsersInfoResponse";

dotenv.config();

export type WelcomeableSource = "teamJoin" | "upgrade"
// Assumes all keys are not undefined
type DefinedUser = {
  [K in keyof User]-?: User[K] 
}

const prisma = new PrismaClient();


const getContinentFromTimezone = (timezone?: string): string => {
  if (!timezone) return "Unknown";

  const [region, city] = timezone.split("/");
  switch (region) {
    case "Asia":
      return "Asia";
    case "Europe":
      return "Europe";
    case "Africa":
      return "Africa";
    case "Australia":
      return "Australia";
    case "Antarctica":
      return "Antarctica";
    case "America":
      return `America: ${city.replaceAll("_", " ").toUpperCase()}`;
    case "Pacific":
      return "Oceania";
    default:
      return "Unknown";
  }
};

const doesWelcomeableExist = async (
  id: string,
  p: PrismaClient,
): Promise<boolean> => {
  const count = await p.welcomeEvent.count({
    where: { newUserId: id },
  });

  if (count > 0) return true;
  return false;
};

export const handleNewWeclomeable = async (
  user_id: string,
  client: WebClient,
  source: WelcomeableSource

) => {
  if (await doesWelcomeableExist(user_id, prisma)) {
    throw new Error("User " + user_id + " already in the database");
  }

  let uInfoReq = await client.users.info({ user: user_id });
  if (!uInfoReq.ok) {
    throw new Error("Error fetching user " + user_id);
  }
  const user = uInfoReq?.user as DefinedUser;
  if (user.is_bot) {
    return;
  }

  await prisma.slackStats.upsert({
    where: { id: 1 },
    update: {
      totalJoins: { increment: 1 },
      pendingWelcomes: { increment: 1 },
    },
    create: {
      id: 1,
      totalJoins: 1,
      pendingWelcomes: 1,
    },
  });

  await prisma.welcomeEvent.create({
    data: {
      newUserId: user.id,
    },
  });

  const userInfo = await client.users.info({ user: user.id });
  const userEmail = userInfo.user?.profile?.email;

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID ?? "",
  );

  let joinReason = "Unknown";
  if (userEmail) {
    try {

    const records = await base("Join Requests")
      .select({
        filterByFormula: `{Email Address} = '${userEmail}'`,
        sort: [{ field: "Created At", direction: "desc" }],
        maxRecords: 1,
        fields: ["Reason"],
      })
      .firstPage();
    if (records.length > 0) {
      joinReason = (records[0].get("Reason") as string) || "Unknown";
    }
    } catch (error) {
      console.log("Ignoring error reading reason from airtable: ", error)
    }
  }
  const continent = getContinentFromTimezone(user.tz);
  const data = {
    userId: user.id,
    continent,
    joinReason,
  };

  await client.chat.postMessage({
    channel: process.env.SLACK_CHANNEL_WELCOMERS ?? "",
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
        fields: [
          {
            type: "mrkdwn",
            text: `*:technologist: User:*\n<@${user.id}>`,
          },
          {
            type: "mrkdwn",
            text: `*:earth_americas: Region:*\n${continent}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*:speech_balloon: Join Reason:* ${joinReason}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "🙋 Welcome Them!",
              emoji: true,
            },
            value: JSON.stringify(data),
            action_id: "lemmewelcomethem",
            style: "primary",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: ":no-adults: Adult!!",
              emoji: true,
            },
            value: data.userId,
            action_id: "report-adult",
            style: "danger",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "Remember to give them a warm welcome! 💖",
          },
        ],
      },
    ],
  });
};
