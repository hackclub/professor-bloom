import { PrismaClient } from "@prisma/client";
import { app } from "../index";

const prisma = new PrismaClient();

export const sendDailyStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const stats = await prisma.slackStats.findFirst({ where: { id: 1 } });
  const dailyJoins = await prisma.welcomeEvent.count({
    where: {
      joinedAt: {
        gte: yesterday,
        lt: today,
      },
    },
  });
  const dailyWelcomed = await prisma.welcomeEvent.count({
    where: {
      completedAt: {
        gte: yesterday,
        lt: today,
      },
      status: "completed",
    },
  });

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "📊 Daily Welcome Stats",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*New Joins:*\n${dailyJoins}`,
        },
        {
          type: "mrkdwn",
          text: `*Welcomed:*\n${dailyWelcomed}`,
        },
        {
          type: "mrkdwn",
          text: `*Pending Welcomes:*\n${stats?.pendingWelcomes || 0}`,
        },
        {
          type: "mrkdwn",
          text: `*Total Welcomed:*\n${stats?.totalWelcomed || 0}`,
        },
      ],
    },
  ];

  await app.client.chat.postMessage({
    channel: process.env.SLACK_WELCOMER_COMMS_CHANNEL || "",
    blocks: blocks,
    text: "Daily Welcome Stats", // Fallback text
  });
};
