import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "../guard/roles.guard";
import { CorsMiddleware } from "../middleware/cors.middleware";
import { AuthModule } from "./auth/auth.module";
import { LogModule } from "./log/log.module";
import { SendEmailModule } from "./send-email/send-email.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule, LogModule, SendEmailModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes("*");
  }
}
