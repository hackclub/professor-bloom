import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import Airtable from 'airtable';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

type TeamJoinEvent = Middleware<SlackEventMiddlewareArgs<"team_join">>;

const getContinentFromTimezone = (timezone: string): string => {
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
      return `America (figure out which one from the city:P) ${city}`;
    case "Pacific":
      return "Oceania";
    default:
      return "Unknown";
  }
};

export const teamJoin: TeamJoinEvent = async ({ event, client }) => {
  if (event.user.is_bot) {
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
      newUserId: event.user.id,
      status: "pending",
      welcomerId: "none",
      joinedAt: new Date(),
    },
  });

  const userInfo = await client.users.info({ user: event.user.id });
  console.log("User Info", userInfo);
  const userEmail = userInfo.user?.profile?.email;
  console.log("User Email", userEmail);

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID ?? '');

  let joinReason = "Unknown";
  if (userEmail) {
    const records = await base('Join Requests').select({
      filterByFormula: `{Email Address} = '${userEmail}'`,
      sort: [{ field: 'Created At', direction: 'desc' }],
      maxRecords: 1,
      fields: ['Reason']
    }).firstPage();
    console.log("Records", records);
    if (records.length > 0) {
      joinReason = records[0].get('Reason') as string || "Unknown";
    }
  }
  console.log("Join Reason", joinReason);
  const continent = getContinentFromTimezone(event.user.tz);
  const data = {
    userId: event.user.id,
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
            text: `*:technologist: User:*\n<@${event.user.id}>`,
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
