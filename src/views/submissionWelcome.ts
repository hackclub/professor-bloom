import {
  Middleware,
  SlackViewMiddlewareArgs,
  SlackViewAction,
} from "@slack/bolt";

type ViewSubmissionEvent = Middleware<SlackViewMiddlewareArgs<SlackViewAction>>;

export const submissionWelcome: ViewSubmissionEvent = async ({
  ack,
  body,
  view,
  client,
}) => {
  await ack();
  const [userToken, toSendUserID] = view.private_metadata.split(" ");

  const blockKey = Object.keys(view.state.values)[0];
  const text = view.state.values[blockKey].email.value;
  client.chat.postMessage({
    token: userToken,
    channel: toSendUserID,
    text: text?.toString(),
  });
};
