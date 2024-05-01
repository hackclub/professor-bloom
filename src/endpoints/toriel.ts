import { Request, Response } from "express";

import { app } from "../app";
import { sendWelcomeMsg } from "../lib/sendWelcomeMsg";

export async function torielNewUser(req: Request, res: Response) {
  try {
    const body = req.body;

    if (process.env.NODE_ENV === "production") {
      return res.status(200).json({
        error: "This endpoint is disabled in production",
      });
    } else if (!body.userId || !body.continent || !body.joinReason) {
      return res.status(400).json({
        error:
          "Invalid request: Missing Args. Args should be userId, continent, and joinReason",
      });
    } else if (typeof body.userId !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid request: userId must be a string" });
    } else if (typeof body.continent !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid request: continent must be a string" });
    } else if (typeof body.joinReason !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid request: joinReason must be a string" });
    } else if (
      body.continent !== "north_america" &&
      body.continent !== "south_america" &&
      body.continent !== "europe" &&
      body.continent !== "asia" &&
      body.continent !== "africa" &&
      body.continent !== "australia" &&
      body.continent !== "antarctica"
    ) {
      return res.status(400).json({
        error:
          "Invalid request: continent must be one of north_america, south_america, europe, asia, africa, australia, or antarctica",
      });
    } else {
      await sendWelcomeMsg(app.client, body).then(() => {
        return res.status(200).json({ message: "Request received" });
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
