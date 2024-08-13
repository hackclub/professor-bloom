import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";

type TeamJoinEvent = Middleware<SlackEventMiddlewareArgs<"team_join">>;

const getContinentFromTimezone = (timezone: string): string => {
  if (!timezone) return "Unknown";

  const [region, city] = timezone.split("/");
  switch (region) {
    case "Asia":
      return "Asia";
    case "Europe":
      return "Europe";
    case "Africa":
      return "Africa";
    case "Australia":
      return "Australia";
    case "Antarctica":
      return "Antarctica";
    case "America":
      return `America (figure out which one from the city:P) ${city}`;
    case "Pacific":
      return "Oceania";
    default:
      return "Unknown";
  }
};

export const teamJoin: TeamJoinEvent = async ({ event, client }) => {
  const continent = getContinentFromTimezone(event.user.tz);
  const data = {
    userId: event.user.id,
    continent,
    joinReason: "Unknown",
  };
  console.log(data);
  await client.chat.postMessage({
    channel: "C06SU9YMC6R",
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
        text: {
          type: "mrkdwn",
          text: `> *:technologist:  User:* <@${event.user.id}>`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> *:earth_americas:  Continent:* ${continent}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `> *:speech_balloon:  Join Reason:* (WIP)`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Lemme welcome them!",
              emoji: true,
            },
            value: JSON.stringify(data),
            action_id: "lemmewelcomethem",
            style: "primary",
          },
        ],
      },
    ],
  });
};
