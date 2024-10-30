import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openStatisticsModal = async (
  client,
  trigger_id: string,
  isGardener: boolean,
  stats,
) => {
  var empty = undefined;

  return await client.views.open({
    trigger_id,
    view: {
      title: {
        type: "plain_text",
        text: "Gardening Statistics",
        emoji: true,
      },
      type: "modal",
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true,
      },
      blocks: [
        {
          type: "divider",
        },
        {
          type: "section",
          fields: [
            ...(isGardener
              ? [
                  {
                    type: "mrkdwn",
                    text: "*:seedling: Your statistics*",
                  },
                ]
              : []),
            {
              type: "mrkdwn",
              text: "*:hackclub: Global statistics*",
            },
          ],
        },
        {
          type: "divider",
        },
        {
          type: "section",
          fields: [
            ...(isGardener
              ? [
                  {
                    type: "mrkdwn",
                    text: `*${stats.user.allTime}* users welcomed`,
                  },
                ]
              : []),
            {
              type: "mrkdwn",
              text: `*${stats.global.allTime}* users welcomed`,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":earth_americas: All Time",
            },
          ],
        },
        {
          type: "section",
          fields: [
            ...(isGardener
              ? [
                  {
                    type: "mrkdwn",
                    text: `*${stats.user.monthly}* users welcomed`,
                  },
                ]
              : []),
            {
              type: "mrkdwn",
              text: `*${stats.global.monthly}* users welcomed`,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":calendar: This month (October)",
            },
          ],
        },
        {
          type: "section",
          fields: [
            ...(isGardener
              ? [
                  {
                    type: "mrkdwn",
                    text: `*${stats.user.lastSevenDays}* users welcomed`,
                  },
                ]
              : []),
            {
              type: "mrkdwn",
              text: `*${stats.global.lastSevenDays}* users welcomed`,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":hourglass: Last 7 days",
            },
          ],
        },
        {
          type: "section",
          fields: [
            ...(isGardener
              ? [
                  {
                    type: "mrkdwn",
                    text: `*${stats.user.weekToDate}* users welcomed`,
                  },
                ]
              : []),
            {
              type: "mrkdwn",
              text: `*${stats.global.weekToDate}* users welcomed`,
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: ":clock4: Week to date (Monday -> Wednesday)",
            },
          ],
        },
      ],
    },
  });
};

const getStatistics = async (id: string, isGardener: boolean) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setDate(today.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const firstOfMonth = new Date(today);
  firstOfMonth.setDate(1);

  const firstOfWeek = new Date(today);
  firstOfWeek.setDate(firstOfWeek.getDate() - ((firstOfWeek.getDay() + 6) % 7));

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const globalStats = await getWelcomeData(
    today,
    yesterday,
    firstOfMonth,
    firstOfWeek,
    weekAgo,
  );
  var userStats = {};

  if (isGardener) {
    userStats = {
      daily: globalStats.daily.filter((event) => event.welcomerId === id)
        .length,
      allTime: globalStats.allTime.filter((event) => event.welcomerId === id)
        .length,
      monthly: globalStats.monthly.filter((event) => event.welcomerId === id)
        .length,
      weekToDate: globalStats.weekToDate.filter(
        (event) => event.welcomerId === id,
      ).length,
      lastSevenDays: globalStats.lastSevenDays.filter(
        (event) => event.welcomerId === id,
      ).length,
    };
  }

  return {
    global: {
      allTime: globalStats.allTime.length,
      monthly: globalStats.monthly.length,
      weekToDate: globalStats.weekToDate.length,
      lastSevenDays: globalStats.lastSevenDays.length,
    },
    user: userStats,
  };
};

const getWelcomeData = async (
  today: Date,
  yesterday: Date,
  firstOfMonth: Date,
  firstOfWeek: Date,
  weekAgo: Date,
) => {
  var startTime = performance.now();

  const total = await prisma.welcomeEvent.findMany({
    where: { status: "completed" },
  });

  const dailyWelcomed = await prisma.welcomeEvent.findMany({
    where: {
      completedAt: {
        gte: yesterday,
        lt: today,
      },
      status: "completed",
    },
  });
  const monthlyWelcomed = await prisma.welcomeEvent.findMany({
    where: {
      completedAt: {
        gte: firstOfMonth,
        lt: today,
      },
      status: "completed",
    },
  });
  const weekToDateWelcomed = await prisma.welcomeEvent.findMany({
    where: {
      completedAt: {
        gte: firstOfWeek,
        lt: today,
      },
      status: "completed",
    },
  });
  const lastSevenDaysWelcomed = await prisma.welcomeEvent.findMany({
    where: {
      completedAt: {
        gte: weekAgo,
        lt: today,
      },
      status: "completed",
    },
  });

  var endTime = performance.now();
  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

  return {
    daily: dailyWelcomed,
    allTime: total,
    monthly: monthlyWelcomed,
    weekToDate: weekToDateWelcomed,
    lastSevenDays: lastSevenDaysWelcomed,
  };
};

export const handleStatistics = async ({ ack, body, client, action }) => {
  try {
    await ack();
  } catch (error) {
    console.error("Error acknowledging request:", error);
    return;
  }

  const users = (
    await prisma.user.findMany({
      select: { slack: true },
    })
  ).map((user) => user.slack);

  const stats = await getStatistics(body.user.id, users.includes(body.user.id));

  await openStatisticsModal(
    client,
    body.trigger_id,
    users.includes(body.user.id),
    stats,
  );
};
