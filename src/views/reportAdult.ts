import { SlackAction, SlackViewAction, SlackViewMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { slackClient } from "../index";

export type validReportSources = "msg" | "wlc";

export const handleReportAdultSubmission = async ({
  ack,
  view,
  body,
}) => {

  const client = slackClient;
  await ack();
  const userId = body.user.id;
  const metadata = view.private_metadata;
  const [reportedUserId, messageTs, reportSource, channelId ]: [string,string,validReportSources,string?] = metadata.split(":");
  const reasonBlock = view.state.values.adult_reason;
  const reason = reasonBlock["report_adult-action"].value;

  const communicatedBlock = view.state.values.communicated;
  let communicated = "";
  if (communicatedBlock) {
    communicated = communicatedBlock["communicated-action"].selected_option.value;
  }

  let reportedMessageUrl: undefined | string = undefined;
    if (channelId && reportSource == "msg") {
      reportedMessageUrl = (await client.chat.getPermalink({channel:channelId,message_ts:messageTs})).permalink;
    }
  
  await client.chat.postMessage({
    channel: process.env.SLACK_FD_LOGS!!,
    text: `:rotating_light: <@${userId}> has reported <@${reportedUserId}> as an adult through ${reportSource == "msg" ? "a message":"a welcome"}. :rotating_light:
    
*Reason:*
\`\`\`${reason}\`\`\`
    
${reportedMessageUrl &&`*Reported message:* ${reportedMessageUrl}`}    
${reportSource === "wlc" ? `*Confirmed in DMs:* ${communicated == "yes" ? ":white_check_mark:" : ":red-x:"}` : ""}
    
_Please react to this message with :white_check_mark: once dealt with._`,
  });

  if (reportSource == "wlc") {
  await client.chat.update({
    channel: process.env.SLACK_CHANNEL_WELCOMERS!!,
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
  }

};
