import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import Airtable from "airtable";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { handleNewWelcomeable } from "../handlers/newWelcomeable";

dotenv.config();

type TeamJoinEvent = Middleware<SlackEventMiddlewareArgs<"team_join">>;

export const teamJoin: TeamJoinEvent = async ({ event, client }) => {
  try {
  await handleNewWelcomeable(event.user.id, client, "teamJoin");
  } catch (error) {
    console.error("Error handling teamJoin:", error)
  }
};
