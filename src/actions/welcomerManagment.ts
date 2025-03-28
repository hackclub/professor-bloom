import { PrismaClient } from "@prisma/client";
import { isUserAdmin, createHomeView } from "../events/home";

const prisma = new PrismaClient();

export const handleWelcomerActions = async ({ ack, body, action, client }) => {
  await ack();
  const [actionType, welcomerId] = action.selected_option.value.split("::");

  switch (actionType) {
    case "view_edit_transcript":
      await handleViewEditTranscript({ body, client, welcomerId });
      break;
    case "remove_welcomer":
      await handleRemoveWelcomer({ body, client, welcomerId });
      break;
    case "toggle_admin":
      await handleToggleAdmin({ body, client, welcomerId });
      break;
    case "view_welcomed_users":
      await handleViewWelcomedUsers({ body, client, welcomerId });
      break;
    default:
      console.error(`Unknown action type: ${actionType}`);
  }
};

const handleViewEditTranscript = async ({ body, client, welcomerId }) => {
  try {
    const welcomer = await prisma.user.findUnique({
      where: { slack: welcomerId },
      select: { transcript: true, id: true },
    });

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "edit_welcomer_transcript_modal",
        private_metadata: welcomerId,
        title: {
          type: "plain_text",
          text: `Edit ${welcomer?.id}'s Transcript`,
        },
        submit: {
          type: "plain_text",
          text: "Save",
        },
        blocks: [
          {
            type: "input",
            block_id: "transcript_input",
            element: {
              type: "plain_text_input",
              multiline: true,
              initial_value: welcomer?.transcript ?? "",
              action_id: "transcript_text",
            },
            label: {
              type: "plain_text",
              text: "Welcomer's Transcript",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error opening edit welcomer transcript modal:", error);
  }
};

const handleRemoveWelcomer = async ({ body, client, welcomerId }) => {
  try {
    await prisma.user.delete({
      where: { slack: welcomerId },
    });

    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: `Successfully removed <@${welcomerId}> as a welcomer.`,
    });

    const isAdmin = await isUserAdmin(body.user.id);
    await client.views.publish({
      user_id: body.user.id,
      view: await createHomeView(body, isAdmin),
    });
  } catch (error) {
    console.error("Error removing welcomer:", error);
    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: "An error occurred while removing the welcomer. Please try again.",
    });
  }
};

const handleToggleAdmin = async ({ body, client, welcomerId }) => {
  try {
    const welcomer = await prisma.user.findUnique({
      where: { slack: welcomerId },
      select: { admin: true },
    });

    await prisma.user.update({
      where: { slack: welcomerId },
      data: { admin: !welcomer?.admin },
    });

    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: `Successfully ${welcomer?.admin ? "removed" : "added"} <@${welcomerId}> ${
        welcomer?.admin ? "from" : "as"
      } an admin.`,
    });

    const isAdmin = await isUserAdmin(body.user.id);
    await client.views.publish({
      user_id: body.user.id,
      view: await createHomeView(body, isAdmin),
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: "An error occurred while updating admin status. Please try again.",
    });
  }
};

const handleViewWelcomedUsers = async ({ body, client, welcomerId }) => {
  try {
    const welcomedUsers = await prisma.welcomeEvent.findMany({
      where: { welcomerId: welcomerId, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: { newUserId: true, completedAt: true },
    });

    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `Users Welcomed by <@${welcomerId}>`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            welcomedUsers.length > 0
              ? welcomedUsers
                  .map(
                    (user) =>
                      `• <@${user.newUserId}> - ${user.completedAt?.toLocaleDateString() ?? "Date not available"}`,
                  )
                  .join("\n")
              : "No users welcomed yet.",
        },
      },
    ];

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Welcomed Users",
          emoji: true,
        },
        close: {
          type: "plain_text",
          text: "Close",
          emoji: true,
        },
        blocks: blocks,
      },
    });
  } catch (error) {
    console.error("Error viewing welcomed users:", error);
    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: "An error occurred while fetching welcomed users. Please try again.",
    });
  }
};

export const handleAddWelcomer = async ({ ack, body, client }) => {
  await ack();
  const triggerId = body.trigger_id;

  try {
    await client.views.open({
      trigger_id: triggerId,
      view: {
        type: "modal",
        callback_id: "add_welcomer_modal",
        title: {
          type: "plain_text",
          text: "Add Welcomer",
        },
        submit: {
          type: "plain_text",
          text: "Add",
        },
        blocks: [
          {
            type: "input",
            block_id: "user_select",
            element: {
              type: "users_select",
              placeholder: {
                type: "plain_text",
                text: "Select a user",
              },
              action_id: "selected_user",
            },
            label: {
              type: "plain_text",
              text: "Select user to add as welcomer",
            },
          },
          {
            type: "input",
            block_id: "username_input",
            element: {
              type: "plain_text_input",
              action_id: "username",
              placeholder: {
                type: "plain_text",
                text: "Enter username",
              },
            },
            label: {
              type: "plain_text",
              text: "Username",
            },
          },
          {
            type: "input",
            block_id: "admin_select",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select admin status",
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Admin",
                  },
                  value: "true",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "Not Admin",
                  },
                  value: "false",
                },
              ],
              action_id: "admin_status",
            },
            label: {
              type: "plain_text",
              text: "Admin Status",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error opening add welcomer modal:", error);
  }
};

export const handleAddWelcomerSubmission = async ({
  ack,
  body,
  view,
  client,
}) => {
  await ack();
  const userId = view.state.values.user_select.selected_user.selected_user;
  const username = view.state.values.username_input.username.value;
  const isAdmin =
    view.state.values.admin_select.admin_status.selected_option.value ===
    "true";

  try {
    await prisma.user.upsert({
      where: { slack: userId },
      update: { admin: isAdmin, id: username },
      create: { id: username, slack: userId, admin: isAdmin, transcript: "" },
    });

    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: `Successfully added <@${userId}> as a welcomer${isAdmin ? " and admin" : ""}.`,
    });

    const currentUserIsAdmin = await isUserAdmin(body.user.id);
    await client.views.publish({
      user_id: body.user.id,
      view: await createHomeView(body, currentUserIsAdmin),
    });
  } catch (error) {
    console.error("Error adding welcomer:", error);
    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: "An error occurred while adding the welcomer. Please try again.",
    });
  }
};
