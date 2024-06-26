// src/log/log.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LogService } from "./log.service";
import { LoggingMiddleware } from "./logging.middleware";
import { LogController } from "./log.controller";

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
