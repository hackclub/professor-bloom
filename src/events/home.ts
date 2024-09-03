import { Middleware, SlackEventMiddlewareArgs, View } from "@slack/bolt";
import { PrismaClient } from "@prisma/client";

type HomeEvent = Middleware<SlackEventMiddlewareArgs<"app_home_opened">>;

const prisma = new PrismaClient();

const getAllWelcomers = async () => await prisma.user.findMany({
  select: { slack: true, id: true, admin: true },
});

const createDashboardSection = (event: any): any[] => [
  {
    type: "header",
    text: { type: "plain_text", text: "🌸 Professor Bloom's Dashboard 🌸", emoji: true },
  },
  {
    type: "section",
    text: { type: "mrkdwn", text: `*Welcome, <@${event.user}>!* :wave: Here's your garden overview:` },
  },
  { type: "divider" },
  {
    type: "section",
    fields: [
      { type: "mrkdwn", text: "*🌱 Pending Welcomes*\n*{wip}* new members" },
      { type: "mrkdwn", text: "*🌼 Upcoming Follow-ups*\n*{wip}* check-ins" },
      { type: "mrkdwn", text: "*🌻 Completed Follow-ups*\n*{wip}* this week" },
    ],
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: { type: "plain_text", text: "View Pending Welcomes", emoji: true },
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
        text: { type: "plain_text", text: "Edit Welcome Template", emoji: true },
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
    elements: [{ type: "mrkdwn", text: ":seedling: Remember to take breaks and stay hydrated!" }],
  },
];

const createAdminSection = async (): Promise<any[]> => {
  const allWelcomers = await getAllWelcomers();
  return [
    { type: "divider" },
    {
      type: "header",
      text: { type: "plain_text", text: "🛠 Admin Tools", emoji: true },
    },
    {
      type: "section",
      text: { type: "mrkdwn", text: "*Welcomers Management*" },
    },
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
    ...allWelcomers.map((welcomer) => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `• <@${welcomer.slack}> (${welcomer.id})${welcomer.admin ? " 👑" : ""}`,
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
            text: { type: "plain_text", text: `${welcomer.admin ? "Remove Admin" : "Make Admin"}`, emoji: true },
            value: `toggle_admin::${welcomer.slack}`,
          },
        ],
        action_id: "welcomer_actions",
      },
    })),
  ];
};

export const createHomeView = async (event: any, isAdmin: boolean): Promise<View> => ({
  type: "home",
  blocks: [...createDashboardSection(event), ...(isAdmin ? await createAdminSection() : [])],
});

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { slack: userId }, select: { admin: true } });
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
