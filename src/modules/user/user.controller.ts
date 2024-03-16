import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":token")
  async findToken(@Param("token") token: string) {
    return this.userService.findToken(token);
  }
}
