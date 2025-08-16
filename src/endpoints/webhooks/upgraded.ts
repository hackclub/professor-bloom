interface WebhookData {
  user_id: string;
}

function isValidWebhookData(data: any) {
  if (!data.user_id) return false;

  return true;
}

import { Request, Response } from "express";
import { app } from "src";
import { handleNewWeclomeable } from "src/handlers/newWelcomeable";
const valid_upgrade_webhook_tokens =
  process.env.UPGRADE_WEBHOOK_TOKENS?.split(" ");
export async function upgradedWebhook(req: Request, res: Response) {
  if (!valid_upgrade_webhook_tokens?.includes(req?.params["token"]))
    return res.status(401).json({ message: "unauthorized" });

  const body: WebhookData = req.body;
  if (!isValidWebhookData(body))
    return res.status(400).json({ message: "malformed request" });

  try {
    const { client } = app;
    await handleNewWeclomeable(body.user_id, client);
  } catch {
    return res.status(500).json({ message: "internal server error" });
  }

  return res.status(200).json({ message: "ok" });
}
