import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { LogModule } from "./log/log.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule, LogModule],
})
export class AppModule {}
