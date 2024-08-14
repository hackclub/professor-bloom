import { Middleware, SlackEventMiddlewareArgs, View } from "@slack/bolt";
import { PrismaClient } from "@prisma/client";

type HomeEvent = Middleware<SlackEventMiddlewareArgs<"app_home_opened">>;

const prisma = new PrismaClient();

const getWelcomersID = async (): Promise<string[]> => {
  const users = await prisma.user.findMany({
    select: { slack: true },
  });
  return users.map((user) => user.slack);
};

const createHomeView = (
  event: any,
  // pendingWelcomes: number,
  // upcomingFollowUps: number,
  // completedFollowUps: number,
  isAdmin: boolean,
  // welcomers: JSON[]
): View => {
  const blocks: any[] = [
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
        text: `*Hi <@${event.user}>!* :wave: Welcome to your dashboard! Here's what's happening in your garden today:`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🌱 Pending Welcomes*: *{wip}* \n\n You have *{wip}* people waiting for a warm welcome. Let's make them feel at home!`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🌼 Upcoming Follow-ups*: *{wip}* \n\n Don't forget to check in with these people soon! 🌟`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🌻 Follow-ups Completed*: *{wip}* \n\n Well done! Thanks for helping with Hack Club magic! 💪`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "🌷 Edit Welcome Template",
            emoji: true,
          },
          style: "primary",
          action_id: "edit_welcome_template",
        },
        //   {
        //     type: "button",
        //     text: {
        //       type: "plain_text",
        //       text: "🌱 View All Follow-ups",
        //       emoji: true,
        //     },
        //     action_id: "view_all_followups",
        //   },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: ":seedling: Make sure to take care of yourself and stay hydrated!",
        },
      ],
    },
  ];

  // Admin section
  // if (isAdmin) {
  //   blocks.push(
  //     {
  //       type: "divider",
  //     },
  //     {
  //       type: "header",
  //       text: {
  //         type: "plain_text",
  //         text: "🛠 Admin Tools",
  //         emoji: true,
  //       },
  //     },
  //     {
  //       type: "section",
  //       text: {
  //         type: "mrkdwn",
  //         text: "*Welcomers Management*",
  //       },
  //     },
  //     {
  //       type: "section",
  //       text: {
  //         type: "mrkdwn",
  //         text: welcomers.length
  //           ? welcomers.map((welcomer) => `• <@${welcomer}>`).join("\n")
  //           : "No welcomers assigned yet.",
  //       },
  //     },
  //     {
  //       type: "actions",
  //       elements: [
  //         {
  //           type: "button",
  //           text: {
  //             type: "plain_text",
  //             text: "➕ Add Welcomer",
  //             emoji: true,
  //           },
  //           action_id: "add_welcomer",
  //         },
  //         ...welcomers.map((welcomer) => ({
  //           type: "button",
  //           text: {
  //             type: "plain_text",
  //             text: `❌ Remove <@${welcomer}>`,
  //             emoji: true,
  //           },
  //           action_id: `remove_welcomer_${welcomer}`,
  //         })),
  //       ],
  //     },
  //     {
  //       type: "context",
  //       elements: [
  //         {
  //           type: "mrkdwn",
  //           text: ":chart_with_upwards_trend: View and manage your welcoming team and stats here.",
  //         },
  //       ],
  //     }
  //   );
  // }

  return {
    type: "home",
    blocks,
  };
};

export const handleHomeTab: HomeEvent = async ({ event, client }) => {
  try {
    const welcomers = await getWelcomersID();
    if (welcomers.includes(event.user)) {
      await client.views.publish({
        user_id: event.user,
        view: createHomeView(event, false),
      });
    }
  } catch (error) {
    console.log("Error publishing home view:", error);
  }
};
