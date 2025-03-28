export const handleReportAdultSubmission = async ({
  ack,
  view,
  body,
  client,
}) => {
  await ack();
  const userId = body.user.id;
  const metadata = view.private_metadata;
  const [reportedUserId, messageTs] = metadata.split(":");
  const reasonBlock = view.state.values.adult_reason;
  const communicatedBlock = view.state.values.communicated;
  const reason = reasonBlock["report_adult-action"].value;
  const communicated =
    communicatedBlock["communicated-action"].selected_option.value;

  await client.chat.postMessage({
    channel: process.env.SLACK_FD_LOGS,
    text: `:rotating_light: <@${userId}> has reported <@${reportedUserId}> as an adult. :rotating_light:\n\n*Reason:*\n\`\`\`${reason}\`\`\`\n\n*Confirmed in DMs:* ${communicated == "yes" ? ":white_check_mark:" : ":red-x:"}\n\n_Please react to this message with :white_check_mark: once dealt with._`,
  });
  await client.chat.update({
    channel: process.env.SLACK_CHANNEL_WELCOMERS,
    ts: messageTs,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "Someone new joined the slack! :partyparrot:",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_See the details below..._",
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*:technologist: User:*\n<@${reportedUserId}>`,
          },
          {
            type: "mrkdwn",
            text: `*:rotating_light: Reported as adult by:*\n<@${userId}>`,
          },
        ],
      },
    ],
  });
};
