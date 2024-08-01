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
import { TaskService } from "./task.service";

@Controller("task")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() data: TaskDto) {
    return this.taskService.create(data);
  }

  @Get()
  @Roles(Role.Master)
  list(@Headers("authorization") authorization: string) {
    return this.taskService.list(authorization);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.taskService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateTaskDto: TaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.taskService.remove(id);
  }
}
