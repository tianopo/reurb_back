import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Role, Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard } from "../../guard/auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Gestor, Role.Admin)
  async createUser(@Body() data: UserDto) {
    return this.userService.createUser(data);
  }

  @Post("employee")
  @Roles(Role.Gestor, Role.Admin)
  async createEmployee(@Body() data: EmployeeDto) {
    return this.userService.createEmployee(data);
  }

  @Post("client")
  @Roles(Role.Gestor, Role.Admin)
  async createClient(@Body() data: ClientDto) {
    return this.userService.createClient(data);
  }

  @Put(":id")
  @Roles(Role.Gestor, Role.Admin)
  async update(@Param("id") id: string, @Body() data: UserDto) {
    return this.userService.update(id, data);
  }

  @Put("recover-password")
  async updateRecoverPassword(@Body() data: RecoverPasswordDto) {
    return this.userService.updateRecoverPassword(data);
  }

  @Put("employee/:id")
  @Roles(Role.Gestor, Role.Admin, Role.Funcionario)
  async updateEmployee(@Param("id") id: string, @Body() data: EmployeeDto) {
    return this.userService.updateEmployee(id, data);
  }

  @Put("client/:id")
  @Roles(Role.Gestor, Role.Admin, Role.Cliente)
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

  @Get("employee/funcionario")
  async getEmployees() {
    return this.userService.getEmployees();
  }

  @Get("client/employee")
  async getClientsAndEmployees() {
    return this.userService.getClientsAndEmployees();
  }

  @Delete(":id")
  @Roles(Role.Gestor, Role.Admin)
  async delete(@Param("id") id: string) {
    return this.userService.delete(id);
  }

  @Get(":token")
  async findToken(@Param("token") token: string) {
    return this.userService.findToken(token);
  }
}
