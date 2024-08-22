import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Role, Roles } from "../../decorators/roles.decorator";
import { JwtAuthGuard } from "../../guard/auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin)
  async createUser(@Body() data: UserDto) {
    return this.userService.createUser(data);
  }

  @Post("employee")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin)
  async createEmployee(@Body() data: EmployeeDto, @Headers("authorization") authorization: string) {
    return this.userService.createEmployee(data, authorization);
  }

  @Post("client")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin)
  async createClient(@Body() data: ClientDto, @Headers("authorization") authorization: string) {
    return this.userService.createClient(data, authorization);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin)
  async update(@Param("id") id: string, @Body() data: UserDto) {
    return this.userService.update(id, data);
  }

  @Put("recover/password")
  async updateRecoverPassword(@Body() data: RecoverPasswordDto) {
    console.log("updateRecoverPassword");
    return this.userService.updateRecoverPassword(data);
  }

  @Put("employee/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin, Role.Funcionario)
  async updateEmployee(@Param("id") id: string, @Body() data: EmployeeDto) {
    return this.userService.updateEmployee(id, data);
  }

  @Put("client/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin, Role.Cliente)
  async updateClient(@Param("id") id: string, @Body() data: ClientDto) {
    return this.userService.updateClient(id, data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async list(@Headers("authorization") authorization: string) {
    return this.userService.list(authorization);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getId(@Param("id") id: string) {
    return await this.userService.getId(id);
  }

  @Get("employee/funcionario")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getEmployees() {
    return this.userService.getEmployees();
  }

  @Get("client/cliente")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClients() {
    return this.userService.getClients();
  }

  @Get("client/employee")
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClientsAndEmployees() {
    return this.userService.getClientsAndEmployees();
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Gestor, Role.Admin)
  async delete(@Param("id") id: string, @Headers("authorization") authorization: string) {
    return this.userService.delete(id, authorization);
  }

  @Get(":token")
  async findToken(@Param("token") token: string) {
    return this.userService.findToken(token);
  }
}
