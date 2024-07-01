// src/log/log.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LogService } from "./log.service";
import { LogController } from "./log.controller";
import { LoggingMiddleware } from "../../middleware/logging.middleware";

@Module({
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService],
})
export class LogModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
