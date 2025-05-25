import { PrismaClient } from "@prisma/client";
import { app } from "../index";

const prisma = new PrismaClient();

export interface WelcomerStats {
  welcomerId: string;
  welcomerName: string;
  count: number;
}

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
  const dailyWelcomers = await prisma.welcomeEvent.groupBy({
    by: ["welcomerId"],
    where: {
      completedAt: {
        gte: yesterday,
        lt: today,
      },
      status: "completed",
      welcomerId: {
        not: null,
      },
    },
    _count: {
      welcomerId: true,
    },
  });
  
  const welcomerStats: WelcomerStats[] = [];
  for (const welcomer of dailyWelcomers) {
    if (welcomer.welcomerId) {
      const user = await prisma.user.findUnique({
        where: { slack: welcomer.welcomerId },
      });
      if (user) {
        welcomerStats.push({
          welcomerId: welcomer.welcomerId,
          welcomerName: `<@${welcomer.welcomerId}>`,
          count: welcomer._count.welcomerId,
        });
      }
    }
  }
  
  const dailyWelcomed = welcomerStats.reduce((sum, welcomer) => sum + welcomer.count, 0);
  
  welcomerStats.sort((a, b) => b.count - a.count);

  const topWelcomers = welcomerStats.slice(0, 3);
  
  const topWelcomersText = topWelcomers.map((welcomer, index) => {
    const medals = ["🥇", "🥈", "🥉"];
    return `${medals[index] || ""} ${welcomer.welcomerName}: ${welcomer.count} welcomes`;
  }).join("\n");

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
    {
      "type": "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Top Welcomers Today:*",
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: topWelcomersText || "No welcomes today :(",
      },
    }
  ];

  const messageResponse = await app.client.chat.postMessage({
    channel: process.env.SLACK_WELCOMER_COMMS_CHANNEL || "",
    blocks: blocks,
    text: "Daily Welcome Stats",
    token: process.env.SLACK_BOT_TOKEN
  });
  
  const leaderboardText = welcomerStats.map((welcomer, index) => {
    const medals = ["🥇 ", "🥈 ", "🥉 "];
    return `${index + 1}. ${welcomer.welcomerName}: ${welcomer.count} welcomes`;
  })
  
  if (messageResponse.ts) {
    await app.client.chat.postMessage({
      channel: process.env.SLACK_WELCOMER_COMMS_CHANNEL || "",
      text: `*Full Leaderboard:*\n${leaderboardText.join("\n")}`,
      thread_ts: messageResponse.ts,
      token: process.env.SLACK_BOT_TOKEN
    })
  }
};
