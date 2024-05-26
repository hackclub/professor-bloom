import { Request, Response } from "express";

const oauthURL = `https://hackclub.slack.com/oauth?client_id=${process.env.SLACK_CLIENT_ID}&user_scope=chat%3Awrite&redirect_uri=&state=&granular_bot_scope=1&single_channel=0&install_redirect=general&tracked=1&team=1`;

export async function slackInstall(req: Request, res: Response) {
  res.redirect(oauthURL);
}

export async function slackOAuthRedirect(req: Request, res: Response) {
  res.status(200).json({ message: "Request received" });
}
