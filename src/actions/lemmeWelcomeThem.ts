import { PrismaClient } from "@prisma/client";
import { installationStore } from "../index";

const prisma = new PrismaClient();

const installUrl =
  process.env.NODE_ENV === "production"
    ? "https://professorbloom.hackclub.com/slack/install"
    : "https://professor-bloom.hackclub.app/slack/install";

const getWelcomersID = async (): Promise<string[]> => {
  const users = await prisma.user.findMany({
    select: { slack: true },
  });
  return users.map((user) => user.slack);
};

const getWelcomeTranscript = async (userID: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { slack: userID },
    select: { transcript: true }, 
  });

  return user?.transcript || "";
};

const isUserInList = (userID: string, list: string[]): boolean =>
  list.includes(userID);

const openWelcomeModal = async (
  client,
  trigger_id: string,
  userID: string,
  extraData,
  transcript: string,
  userToken: string,
) => {
  try {
    return await client.views.open({
      trigger_id,
      view: {
        callback_id: "lemmewelcomethem_form",
        private_metadata: `${userToken} ${extraData.userId}`,
        title: {
          type: "plain_text",
          text: `Welcome a New User!`,
        },
        submit: {
          type: "plain_text",
          text: "Send DM",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Welcomer:* <@${userID}>`,
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*User:* <@${extraData.userId}> \n*Continent:* ${extraData.continent} \n*Join Reason:* ${extraData.joinReason}`,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            element: {
              type: "plain_text_input",
              initial_value: transcript,
              multiline: true,
              action_id: "email",
              focus_on_load: true,
            },
            label: {
              type: "plain_text",
              text: `Message to send to user:`,
              emoji: true,
            },
          },
        ],
        type: "modal",
      },
    });
  } catch (error) {
    console.error("Error opening welcome modal:", error);
    await client.chat.postEphemeral({
      user: userID,
      channel: "C06SU9YMC6R",
      text: "Sorry, something went wrong while opening the welcome modal. Please try again later.",
    });
  }
};

export const handleLemmeWelcomeThem = async ({ ack, body, client, action }) => {
  try {
    await ack();
  } catch (error) {
    console.error("Error acknowledging request:", error);
    return;
  }

  let extraData;
  const userID = body.user.id;

  try {
    extraData = JSON.parse(action.value);
  } catch (error) {
    console.error("Error parsing extra data from body:", error);
    return await client.chat.postEphemeral({
      user: userID,
      channel: body.channel.id,
      text: "Oops! There was an issue processing your request. Please try again.",
    });
  }

  let allIDs: string[];

  try {
    allIDs = await getWelcomersID();
  } catch (error) {
    console.error("Error fetching users from the database:", error);
    return await client.chat.postEphemeral({
      user: userID,
      channel: body.channel.id,
      text: "We're experiencing some technical difficulties. Please try again later.",
    });
  }

  if (!isUserInList(userID, allIDs)) {
    return await client.chat.postEphemeral({
      user: userID,
      channel: body.channel.id,
      text: "Whoa there! How'd you get here? If you think you're in the right place, please reach out to <@U05F4B48GBF> for assistance!",
    });
  }

  let userToken;
  try {
    const installation = await installationStore.fetchInstallation({
      teamId: body.team.id,
      enterpriseId: body.enterprise?.id,
      userId: userID,
      isEnterpriseInstall: body.isEnterpriseInstall,
    });
    userToken = installation.user.token;
  } catch (error) {
    console.error("Error fetching user token:", error);
    await client.chat.postEphemeral({
      user: userID,
      channel: body.channel.id,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Ahoy! Looks like you need to grant Bloom access to send messages on your behalf. Please click the button below to grant access, and then try again!",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Grant Access",
                emoji: true,
              },
              style: "primary",
              url: installUrl,
            },
          ],
        },
      ],
    });
  }

  if (userToken !== undefined) {
    const transcript = await getWelcomeTranscript(userID);
    await openWelcomeModal(
      client,
      body.trigger_id,
      userID,
      extraData,
      transcript,
      userToken,
    );
  }
};
