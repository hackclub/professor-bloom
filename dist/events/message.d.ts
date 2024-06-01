import { Middleware, SlackEventMiddlewareArgs } from "@slack/bolt";
type MessageEvent = Middleware<SlackEventMiddlewareArgs<"message">>;
export declare const messageEvent: MessageEvent;
export {};
