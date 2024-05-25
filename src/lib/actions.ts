export const handleLemmeWelcomeThem = async ({ ack, body, client }) => {
  await ack();

  let extraData = JSON.parse(body.actions[0].value);

  let userwhoopeneddatmodal = body.user.id;

  const result = await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      callback_id: "lemmewelcomethem_form",
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
            text: `*Welcomer:* <@${userwhoopeneddatmodal}>`,
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
            initial_value: extraData.joinReason,
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
};
