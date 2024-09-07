import {
  Middleware,
  SlackViewMiddlewareArgs,
  SlackViewAction,
  KnownBlock,
  SectionBlock
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
  const [userToken, toSendUserID, originalTs] = view.private_metadata.split(" ");
  const blockKey = Object.keys(view.state.values)[0];
  const text = view.state.values[blockKey].email.value;
  
  await client.chat.postMessage({
    token: userToken,
    channel: toSendUserID,
    text: text?.toString(),
  });

  const originalMessage = await client.conversations.history({
    channel: process.env.SLACK_CHANNEL_WELCOMERS ?? "",
    latest: originalTs,
    inclusive: true,
    limit: 1,
  });

  if (originalMessage.messages && originalMessage.messages.length > 0) {
    const updatedBlocks = originalMessage.messages[0].blocks?.map((block: any): KnownBlock => {
      if (block.type === 'actions') {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Being welcomed by <@${body.user.id}> :sunflower:`
          }
        } as SectionBlock;
      }
      return block as KnownBlock;
    });

    if (updatedBlocks) {
      await client.chat.update({
        channel: process.env.SLACK_CHANNEL_WELCOMERS ?? "",
        ts: originalTs,
        blocks: updatedBlocks,
      });
    }
  }

  const welcomeEvent = await prisma.welcomeEvent.findFirst({
    where: { newUserId: toSendUserID, status: "pending" },
    orderBy: { joinedAt: 'desc' },
  });

  if (welcomeEvent) {
    const now = new Date();
    const timeToWelcome = now.getTime() - welcomeEvent.joinedAt.getTime();

    await prisma.welcomeEvent.update({
      where: { id: welcomeEvent.id },
      data: {
        welcomerId: body.user.id,
        status: "completed",
        completedAt: now,
        timeToWelcome: timeToWelcome,
      },
    });

    await prisma.user.update({
      where: { slack: body.user.id },
      data: {
        welcomesGiven: { increment: 1 },
        totalWelcomeTime: { increment: timeToWelcome },
      },
    });
  }

  await prisma.slackStats.update({
    where: { id: 1 },
    data: {
      pendingWelcomes: { decrement: 1 },
      totalWelcomed: { increment: 1 },
    },
  });

  await prisma.user.update({
    where: { slack: body.user.id },
    data: { welcomesGiven: { increment: 1 } },
  });

  await prisma.welcomeEvent.updateMany({
    where: { newUserId: toSendUserID, status: "pending" },
    data: { welcomerId: body.user.id, status: "completed", completedAt: new Date() },
  });
};
