import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CorsMiddleware } from "../middleware/cors.middleware";
import { AuthModule } from "./auth/auth.module";
import { FinancialModule } from "./financial/financial.module";
import { LogModule } from "./log/log.module";
import { ProjectModule } from "./project/project.module";
import { SendEmailModule } from "./send-email/send-email.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    LogModule,
    SendEmailModule,
    TaskModule,
    ProjectModule,
    FinancialModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes("*");
  }
}
