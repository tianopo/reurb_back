import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ]
})
export class UserModule { }
