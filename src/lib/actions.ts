import fs from "fs";
import YAML from "yaml";

const welcomersFile = fs.readFileSync("welcomers.yaml", "utf8");

let installUrl;

if (process.env.NODE_ENV === "production") {
  installUrl = "https://professorbloom.hackclub.com/slack/install";
} else {
  installUrl = "https://e68a-65-19-76-238.ngrok-free.app/slack/install";
}

export const handleLemmeWelcomeThem = async ({ ack, body, client, say }) => {
  await ack();

  let extraData = JSON.parse(body.actions[0].value);

  let userwhoopeneddatmodal = body.user.id;

  // read the yaml file welcomers.yml and get the list of welcomers as an array

  const yml = YAML.parse(welcomersFile);

  const allIDs = yml.map((welcomer) => welcomer.slack);

  // set welcomerIDs to a array of the "slack" value where the welcomeTeam value is true
  const welcomerIDs = yml
    .filter((welcomer) => welcomer.classification === "welcomer")
    .map((welcomer) => welcomer.slack);

  const hqIDs = yml
    .filter((welcomer) => welcomer.classification === "hq")
    .map((welcomer) => welcomer.slack);

  // get the user object (from the yaml file) for the userwhoopeneddatmodal
  const usr = yml.find((welcomer) => welcomer.slack === userwhoopeneddatmodal);

  // get users who have given the app permission to send messages on their behalf
  const users = await client.auth.test({
    token: process.env.SLACK_BOT_TOKEN,
  });

  console.log(users);

  // if (allIDs.includes(userwhoopeneddatmodal)) {
  //   // check if userwhoopeneddatmodal is in any of the arrays
  //   if (
  //     welcomerIDs.includes(userwhoopeneddatmodal) ||
  //     hqIDs.includes(userwhoopeneddatmodal)
  //   ) {
  //     if () {
  //       await client.chat.postEphemeral({
  //         user: userwhoopeneddatmodal,
  //         channel: body.channel.id,
  //         blocks: [
  //           {
  //             type: "section",
  //             text: {
  //               type: "mrkdwn",
  //               text: "Ahoy! Looks like you need to grant Bloom access to send messages on your behalf. Please click the button below to grant access, and then try again!",
  //             },
  //           },
  //           {
  //             type: "actions",
  //             elements: [
  //               {
  //                 type: "button",
  //                 text: {
  //                   type: "plain_text",
  //                   text: "Grant Access",
  //                   emoji: true,
  //                 },
  //                 style: "primary",
  //                 url: oauthURL,
  //               },
  //             ],
  //           },
  //         ],
  //       });
  //     } else {
  //       if (welcomerIDs.includes(userwhoopeneddatmodal)) {
  //         const result = await client.views.open({
  //           trigger_id: body.trigger_id,
  //           view: {
  //             callback_id: "lemmewelcomethem_form",
  //             title: {
  //               type: "plain_text",
  //               text: `WC: Welcome a New User!`,
  //             },
  //             submit: {
  //               type: "plain_text",
  //               text: "Send DM",
  //             },
  //             blocks: [
  //               {
  //                 type: "section",
  //                 text: {
  //                   type: "mrkdwn",
  //                   text: `*Welcomer:* <@${userwhoopeneddatmodal}>`,
  //                 },
  //               },
  //               {
  //                 type: "divider",
  //               },
  //               {
  //                 type: "section",
  //                 text: {
  //                   type: "mrkdwn",
  //                   text: `*User:* <@${extraData.userId}> \n*Continent:* ${extraData.continent} \n*Join Reason:* ${extraData.joinReason}`,
  //                 },
  //               },
  //               {
  //                 type: "divider",
  //               },
  //               {
  //                 type: "input",
  //                 element: {
  //                   type: "plain_text_input",
  //                   initial_value: extraData.joinReason,
  //                   multiline: true,
  //                   action_id: "email",
  //                   focus_on_load: true,
  //                 },
  //                 label: {
  //                   type: "plain_text",
  //                   text: `Message to send to user:`,
  //                   emoji: true,
  //                 },
  //               },
  //             ],
  //             type: "modal",
  //           },
  //         });
  //       } else if (hqIDs.includes(userwhoopeneddatmodal)) {
  //         const result = await client.views.open({
  //           trigger_id: body.trigger_id,
  //           view: {
  //             callback_id: "lemmewelcomethem_form",
  //             title: {
  //               type: "plain_text",
  //               text: `HQ: Welcome a New User!`,
  //             },
  //             submit: {
  //               type: "plain_text",
  //               text: "Send DM",
  //             },
  //             blocks: [
  //               {
  //                 type: "section",
  //                 text: {
  //                   type: "mrkdwn",
  //                   text: `*Welcomer:* <@${userwhoopeneddatmodal}>`,
  //                 },
  //               },
  //               {
  //                 type: "divider",
  //               },
  //               {
  //                 type: "section",
  //                 text: {
  //                   type: "mrkdwn",
  //                   text: `*User:* <@${extraData.userId}> \n*Continent:* ${extraData.continent} \n*Join Reason:* ${extraData.joinReason}`,
  //                 },
  //               },
  //               {
  //                 type: "divider",
  //               },
  //               {
  //                 type: "input",
  //                 element: {
  //                   type: "plain_text_input",
  //                   initial_value: extraData.joinReason,
  //                   multiline: true,
  //                   action_id: "email",
  //                   focus_on_load: true,
  //                 },
  //                 label: {
  //                   type: "plain_text",
  //                   text: `Message to send to user:`,
  //                   emoji: true,
  //                 },
  //               },
  //             ],
  //             type: "modal",
  //           },
  //         });
  //       }
  //     }
  //   } else {
  //     await client.chat.postEphemeral({
  //       user: userwhoopeneddatmodal,
  //       channel: body.channel.id,
  //       text: "Howdy doo! Looks like you need to be assigned a classification. Please reach out to <@U05NX48GL3T> for assistance!",
  //     });
  //   }
  // } else {
  //   await client.chat.postEphemeral({
  //     user: userwhoopeneddatmodal,
  //     channel: body.channel.id,
  //     text: "Whoa there! How'd you get here? If you think you're in the right place, please reach out to <@U05NX48GL3T> for assistance!",
  //   });
  // }
};
