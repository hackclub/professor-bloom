import { Request, Response } from "express";

export async function health(req: Request, res: Response) {
  if (req.path === "/up") {
    res.status(200).json({ message: "ok" });
  } else if (req.path === "/ping") {
    res.status(200).json({ message: "pong" });
  }
}
