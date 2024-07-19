import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CorsMiddleware } from "../middleware/cors.middleware";
import { AuthModule } from "./auth/auth.module";
import { LogModule } from "./log/log.module";
import { UserModule } from "./user/user.module";
import { RecoverPasswordModule } from "./send-email/send-email.module";

@Module({
  imports: [AuthModule, UserModule, LogModule, RecoverPasswordModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes("*");
  }
}
