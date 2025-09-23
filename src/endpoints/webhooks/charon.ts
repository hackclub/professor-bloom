interface WebhookData {
  user_id: string;
  program_id: string;
  program_name: string;
  action: "promotion";
}

function isValidWebhookData(data: any) {
  if (!data.user_id) return false;
  if(!data.program_id) return false;
  if(data.verb && (data.verb == "promotion" )) return true;
  return false;
}

import { Request, Response } from "express";
import { slackClient } from "../../index";
import { handleNewWeclomeable } from "../../handlers/newWelcomeable";
const valid_upgrade_webhook_tokens =
  process.env.UPGRADE_WEBHOOK_TOKENS?.split(" ");


  export async function upgradedWebhook(req: Request, res: Response) {
  if (!valid_upgrade_webhook_tokens?.includes(req?.params["token"]))
    return res.status(401).json({ message: "unauthorized" });

  const body: WebhookData = req.body;
  if (!isValidWebhookData(body))
    return res.status(400).json({ message: "malformed request" });


  try {
    await handleNewWeclomeable(body.user_id, slackClient, body.action);
  } catch (error) {
    console.error("Error handling new upgrade:", error);

    return res.status(500).json({ message: "internal server error" });
  }

  return res.status(200).json({ message: "ok" });
}
