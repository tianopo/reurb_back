// src/log/log.module.ts
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
import { LoggingMiddleware } from "./logging.middleware";

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
