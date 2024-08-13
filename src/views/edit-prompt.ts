import { App } from "@slack/bolt";
import * as fs from "fs/promises";
import * as path from "path";

const handleViewSubmission = async (app: App): Promise<void> => {
  app.view("lemmewelcomethem_form", async ({ ack, body, view, client }) => {
    // Acknowledge the view_submission event
    await ack();
    console.log(body)
  //   const { id: user_id, name: user_name } = body.user;
  //   const channel_id = body.view.private_metadata; // Assuming private_metadata contains the channel ID
  //   const values = view.state.values;
  //   const filePath = path.resolve(__dirname, `../../welcomes/${user_name}.txt`);

  //   try {
  //     // Extracting the input value from the modal
  //     const text = Object.values(values)
  //       .map((valueObject) => valueObject[Object.keys(valueObject)[0]].value)
  //       .filter((value) => value !== null && value !== undefined)[0];

  //     // Write the extracted text to a file
  //     if (text) {
  //       await fs.writeFile(filePath, text.toString());

  //       // Send a confirmation message to the user
  //       await client.chat.postEphemeral({
  //         channel: channel_id,
  //         user: user_id,
  //         text: "Welcome message successfully saved!",
  //       });
  //     } else {
  //       throw new Error("No valid text value found.");
  //     }
  //   } catch (error) {
  //     console.error("Error saving welcome message:", error);
  //     await client.chat.postEphemeral({
  //       channel: channel_id,
  //       user: user_id,
  //       text: "An error occurred while saving the welcome message. Please try again.",
  //     });
  //   }
  // });
};

export default handleViewSubmission;
