import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
import Airtable from "airtable";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { handleNewWeclomeable } from "src/handlers/newWelcomeable";

dotenv.config();

const DO_HANDLE_TEAM_JOIN = !!process.env.ENABLE_TEAM_JOIN_EVENT;
type TeamJoinEvent = Middleware<SlackEventMiddlewareArgs<"team_join">>;

export const teamJoin: TeamJoinEvent = async ({ event, client }) => {
  if (!DO_HANDLE_TEAM_JOIN) return;
  await handleNewWeclomeable(event.user.id, client);
};
