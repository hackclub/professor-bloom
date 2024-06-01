import { Middleware, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { StringIndexed } from "@slack/bolt/dist/types/helpers";
export declare const handleCommand: Middleware<SlackCommandMiddlewareArgs, StringIndexed>;
