import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [TokenModule, JwtModule],
})
export class TaskModule {}
