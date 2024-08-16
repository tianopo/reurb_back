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
import { FinancialDto } from "./dto/financial.dto";
import { FinancialUpdateDto } from "./dto/financialUpdate.dto";
import { FinancialService } from "./financial.service";

@Controller("financial")
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Post()
  @Roles(Role.Gestor, Role.Admin)
  create(@Body() data: FinancialDto) {
    return this.financialService.create(data);
  }

  @Get()
  @Roles(Role.Gestor, Role.Admin, Role.Funcionario)
  list(@Headers("authorization") authorization: string) {
    return this.financialService.list(authorization);
  }

  @Get(":id")
  @Roles(Role.Gestor, Role.Admin)
  getId(@Param("id") id: string) {
    return this.financialService.getId(id);
  }

  @Put(":id")
  @Roles(Role.Gestor, Role.Admin)
  update(@Param("id") id: string, @Body() data: FinancialUpdateDto) {
    return this.financialService.update(id, data);
  }

  @Delete(":id")
  @Roles(Role.Gestor, Role.Admin)
  remove(@Param("id") id: string) {
    return this.financialService.remove(id);
  }
}
