import {
  Middleware,
  SlackViewMiddlewareArgs,
  SlackViewAction,
  KnownBlock,
  SectionBlock,
} from "@slack/bolt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ViewSubmissionEvent = Middleware<SlackViewMiddlewareArgs<SlackViewAction>>;

export const submissionWelcome: ViewSubmissionEvent = async ({
  ack,
  body,
  view,
  client,
}) => {
  await ack();
  const [userToken, toSendUserID, originalTs] =
    view.private_metadata.split(" ");
  const blockKey = Object.keys(view.state.values)[0];
  const text = view.state.values[blockKey].email.value;

  try {
    await client.chat.postMessage({
      token: userToken,
      channel: toSendUserID,
      text: text?.toString(),
    });

    await updateOriginalMessage(client, body.user.id, originalTs);
    await updateWelcomeEvent(body.user.id, toSendUserID);
    await updateStats();
  } catch (error) {
    console.error("Error in submissionWelcome:", error);
    await client.chat.postEphemeral({
      user: body.user.id,
      channel: body.user.id,
      text: "There was an error welcoming this person. Please try again.",
    });
  }
};

async function updateOriginalMessage(
  client,
  userId: string,
  originalTs: string,
) {
  const originalMessage = await client.conversations.history({
    channel: process.env.SLACK_CHANNEL_WELCOMERS ?? "",
    latest: originalTs,
    inclusive: true,
    limit: 1,
  });

  if (originalMessage.messages && originalMessage.messages.length > 0) {
    const updatedBlocks = originalMessage.messages[0].blocks?.map(
      (block: any): KnownBlock => {
        if (block.type === "actions") {
          let welcomeUserId = "";
          for (const element of block.elements) {
            if (element.action_id === "report-adult") {
              welcomeUserId = element.value;
            }
          }
          return {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Being welcomed by <@${userId}> :sunflower:`,
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: ":no-adults: Adult!!",
              },
              style: "danger",
              action_id: "report-adult",
              value: welcomeUserId,
            },
          } as SectionBlock;
        }
        return block as KnownBlock;
      },
    );

    if (updatedBlocks) {
      await client.chat.update({
        channel: process.env.SLACK_CHANNEL_WELCOMERS ?? "",
        ts: originalTs,
        blocks: updatedBlocks,
      });
    }
  }
}

async function updateWelcomeEvent(welcomerId: string, newUserId: string) {
  const welcomeEvent = await prisma.welcomeEvent.findFirst({
    where: { newUserId: newUserId, status: "pending" },
    orderBy: { joinedAt: "desc" },
  });

  if (welcomeEvent) {
    const now = new Date();
    const timeToWelcome = now.getTime() - welcomeEvent.joinedAt.getTime();

    await prisma.$transaction([
      prisma.welcomeEvent.update({
        where: { id: welcomeEvent.id },
        data: {
          welcomerId: welcomerId,
          status: "completed",
          completedAt: now,
          timeToWelcome: timeToWelcome,
        },
      }),
      prisma.user.update({
        where: { slack: welcomerId },
        data: {
          welcomesGiven: { increment: 1 },
          totalWelcomeTime: { increment: timeToWelcome },
        },
      }),
      prisma.welcomeEvent.updateMany({
        where: { newUserId: newUserId, status: "pending" },
        data: { welcomerId: welcomerId, status: "completed", completedAt: now },
      }),
    ]);
  }
}

async function updateStats() {
  await prisma.slackStats.update({
    where: { id: 1 },
    data: {
      pendingWelcomes: { decrement: 1 },
      totalWelcomed: { increment: 1 },
    },
  });
}
