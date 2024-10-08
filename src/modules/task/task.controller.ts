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
import { TaskDto } from "./dto/task.dto";
import { TaskUpdateDto } from "./dto/taskUpdate.dto";
import { TaskService } from "./task.service";

@Controller("task")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(Role.Gestor, Role.Admin)
  create(@Body() data: TaskDto) {
    return this.taskService.create(data);
  }

  @Get()
  list(@Headers("authorization") authorization: string) {
    return this.taskService.list(authorization);
  }

  @Get(":id")
  @Roles(Role.Gestor, Role.Admin)
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @Put(":id")
  @Roles(Role.Gestor, Role.Admin)
  update(@Param("id") id: string, @Body() updateTaskDto: TaskUpdateDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  @Roles(Role.Gestor, Role.Admin)
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
