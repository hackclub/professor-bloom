import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleEditPromptSubmission = async ({
  ack,
  view,
  body,
  client,
}) => {
  await ack();
  const updatedTranscript =
    view.state.values.edit_input_block["edit_input-action"].value;

  try {
    await prisma.user.update({
      where: {
        slack: body.user.id,
      },
      data: {
        transcript: updatedTranscript,
      },
    });
    await client.chat.postMessage({
      channel: body.user.id,
      text: "Your template has been updated successfully!",
    });
  } catch (error) {
    console.error("Error updating transcript:", error);
    await client.chat.postMessage({
      channel: body.user.id,
      text: "There was an error updating your template. Please try again later.",
    });
  }
};
