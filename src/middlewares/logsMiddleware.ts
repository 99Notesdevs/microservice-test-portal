import { Request, Response, NextFunction } from "express";
import { AdminLogRepository } from "../repositories/AdminLogRepository";

export async function logRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    req.authType !== "User"
  ) {
    const user = req.authType || null;
    const id = parseInt(req.authUser!) || null;

    const details = { ...req.body };

    if (
      req.originalUrl.includes("/login") ||
      req.originalUrl.includes("/signup") ||
      req.originalUrl.endsWith("/admin")
    ) {
      if (req.body.password) {
        details.password = "**hidden**";
      }
      if (req.body.secretKey) {
        details.secretKey = "**hidden**";
      }
    }

    res.on("finish", async () => {
      await AdminLogRepository.createLog({
        method: req.method,
        endpoint: req.originalUrl,
        status: res.statusCode < 400 ? "success" : "error",
        user,
        userId: id,
        details: details ? JSON.stringify(details) : null,
      });
    });
  }
  next();
}
