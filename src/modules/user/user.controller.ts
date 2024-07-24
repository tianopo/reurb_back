import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: UserDto) {
    return this.userService.createUser(data);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UserDto) {
    return this.userService.update(id, data);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  @Get(":token")
  async findToken(@Param("token") token: string) {
    return this.userService.findToken(token);
  }
}
