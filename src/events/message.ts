import { App } from "@slack/bolt";

const messageEvent = async (app: App): Promise<void> => {
  app.event("message", async ({ event, client }) => {
    try {
      console.log("\n");
      console.log("message event received");
      console.log(event);
      console.log("\n");
    } catch (e) {
      console.error(e);
    }
  });
};

export default messageEvent;
