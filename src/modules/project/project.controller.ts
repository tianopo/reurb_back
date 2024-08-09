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
import { ProjectDto } from "./dto/project.dto";
import { ProjectService } from "./project.service";

@Controller("project")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.Gestor, Role.Admin)
  create(@Body() data: ProjectDto) {
    return this.projectService.create(data);
  }

  @Get()
  list(@Headers("authorization") authorization: string) {
    return this.projectService.list(authorization);
  }

  @Get(":id")
  @Roles(Role.Gestor, Role.Admin)
  getId(@Param("id") id: string) {
    return this.projectService.getId(id);
  }

  @Put(":id")
  @Roles(Role.Gestor, Role.Admin)
  update(@Param("id") id: string, @Body() data: ProjectDto) {
    return this.projectService.update(id, data);
  }

  @Delete(":id")
  @Roles(Role.Gestor, Role.Admin)
  remove(@Param("id") id: string) {
    return this.projectService.remove(id);
  }
}
