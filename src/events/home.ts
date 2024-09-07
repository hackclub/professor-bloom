import { Middleware, SlackEventMiddlewareArgs, View } from "@slack/bolt";
import { PrismaClient } from "@prisma/client";

type HomeEvent = Middleware<SlackEventMiddlewareArgs<"app_home_opened">>;

const prisma = new PrismaClient();

const getAllWelcomers = async () =>
  await prisma.user.findMany({
    select: { slack: true, id: true, admin: true, welcomesGiven: true, totalWelcomeTime: true },
  });

const createDashboardSection = async (event: any): Promise<any[]> => {
  const stats = await prisma.slackStats.findFirst({ where: { id: 1 } });
  const totalWelcomed = stats?.totalWelcomed || 0;
  const pendingWelcomes = stats?.pendingWelcomes || 0;

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🌸 Professor Bloom's Dashboard 🌸",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Welcome, <@${event.user}>!* :wave: Here's your garden overview:`,
      },
    },
    { type: "divider" },
    {
      type: "header",
      text: { type: "plain_text", text: "🌍 Global Stats", emoji: true },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Total Welcomed:*\n${totalWelcomed}` },
        { type: "mrkdwn", text: `*Pending Welcomes:*\n${pendingWelcomes}` },
      ],
    },
    { type: "divider" },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*🌱 Pending Welcomes*\n*${pendingWelcomes}* new members` },
        { type: "mrkdwn", text: "*🌼 Upcoming Follow-ups*\n*{wip}* check-ins" },
        { type: "mrkdwn", text: "*🌻 Completed Follow-ups*\n*{wip}* this week" },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View Pending Welcomes",
            emoji: true,
          },
          style: "primary",
          action_id: "view_pending_welcomes",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "Upcoming Follow-ups", emoji: true },
          action_id: "view_upcoming_followups",
        },
      ],
    },
    { type: "divider" },
    {
      type: "section",
      text: { type: "mrkdwn", text: "*Quick Actions*" },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Edit Welcome Template",
            emoji: true,
          },
          action_id: "edit_welcome_template",
        },
        {
          type: "button",
          text: { type: "plain_text", text: "View Statistics", emoji: true },
          action_id: "view_statistics",
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: ":seedling: Remember to take breaks and stay hydrated!",
        },
      ],
    }
  ];
};

const createAdminSection = async (): Promise<any[]> => {
  const allWelcomers = await getAllWelcomers();

  const welcomerStatsBlocks = [
    { type: "divider" },
    {
      type: "header",
      text: { type: "plain_text", text: "👥 Welcomer Stats", emoji: true },
    },
  ];

  const welcomerStats = await Promise.all(
    allWelcomers.map(async (welcomer) => {
      const user = await prisma.user.findUnique({
        where: { slack: welcomer.slack },
        select: { welcomesGiven: true, totalWelcomeTime: true },
      });

      const avgWelcomeTime = user?.welcomesGiven
        ? Math.round(user.totalWelcomeTime / user.welcomesGiven / 60000)
        : 0;

      return {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `• <@${welcomer.slack}> (${welcomer.id})${
            welcomer.admin ? " 👑" : ""
          }\n  Welcomes: ${user?.welcomesGiven || 0} | Avg Time: ${avgWelcomeTime} min`,
        },
        accessory: {
          type: "overflow",
          options: [
            {
              text: { type: "plain_text", text: "View/Edit Transcript", emoji: true },
              value: `view_edit_transcript::${welcomer.slack}`,
            },
            {
              text: { type: "plain_text", text: "Remove Welcomer", emoji: true },
              value: `remove_welcomer::${welcomer.slack}`,
            },
            {
              text: {
                type: "plain_text",
                text: `${welcomer.admin ? "Remove Admin" : "Make Admin"}`,
                emoji: true,
              },
              value: `toggle_admin::${welcomer.slack}`,
            },
            {
              text: { type: "plain_text", text: "View Welcomed Users", emoji: true },
              value: `view_welcomed_users::${welcomer.slack}`,
            },
          ],
          action_id: "welcomer_actions",
        },
      };
    })
  );

  return [
    ...welcomerStatsBlocks,
    ...welcomerStats,
    { type: "divider" },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "➕ Add Welcomer", emoji: true },
          style: "primary",
          action_id: "add_welcomer",
        },
      ],
    },
  ];
};

export const createHomeView = async (
  event: any,
  isAdmin: boolean,
): Promise<View> => ({
  type: "home",
  blocks: [
    ...(await createDashboardSection(event)),
    ...(isAdmin ? await createAdminSection() : []),
  ],
});

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { slack: userId },
    select: { admin: true },
  });
  return user?.admin || false;
};

export const handleHomeTab: HomeEvent = async ({ event, client }) => {
  try {
    const isAdmin = await isUserAdmin(event.user);
    await client.views.publish({
      user_id: event.user,
      view: await createHomeView(event, isAdmin),
    });
  } catch (error) {
    console.error("Error publishing home view:", error);
  }
};
