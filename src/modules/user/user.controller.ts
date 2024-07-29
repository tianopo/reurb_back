import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../../config/roles.guard";
import { Role, Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard } from "../../guard/auth.guard";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() data: UserDto) {
    return this.userService.createUser(data);
  }

  @Post("employee")
  @Roles(Role.Admin, Role.Master, Role.Funcionario)
  async createEmployee(@Body() data: EmployeeDto) {
    return this.userService.createEmployee(data);
  }

  @Post("client")
  async createClient(@Body() data: ClientDto) {
    return this.userService.createClient(data);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: UserDto) {
    return this.userService.update(id, data);
  }

  @Put("employee/:id")
  @Roles(Role.Admin, Role.Master, Role.Funcionario)
  async updateEmployee(@Param("id") id: string, @Body() data: EmployeeDto) {
    return this.userService.updateEmployee(id, data);
  }

  @Put("client/:id")
  @Roles(Role.Admin, Role.Master, Role.Cliente)
  async updateClient(@Param("id") id: string, @Body() data: ClientDto) {
    return this.userService.updateClient(id, data);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(":id")
  async getId(@Param("id") id: string) {
    return await this.userService.getId(id);
  }

  @Delete(":id")
  @Roles(Role.Admin, Role.Master)
  async delete(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  @Get(":token")
  async findToken(@Param("token") token: string) {
    return this.userService.findToken(token);
  }
}
