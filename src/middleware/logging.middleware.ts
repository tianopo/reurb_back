// src/log/logging.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LogService } from "../modules/log/log.service";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logService: LogService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;

      const currentDateTime = new Date().toISOString();
      const date = currentDateTime.split("T")[0];
      const time = currentDateTime.split("T")[1].substring(0, 8);

      console.log(`[${date} - ${time}] ${req.method} ${req.originalUrl} - ${duration}ms`);

      this.logService.create({
        routeName: req.url,
        method: req.method,
        duration,
        time: `${date} - ${time}`,
      });
    });
    next();
  }
}
