import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { JwtModule } from "@nestjs/jwt";
import { TokenModule } from "../token/token.module";

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [TokenModule, JwtModule],
})
export class ProjectModule {}
