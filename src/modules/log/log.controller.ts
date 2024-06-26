// src/log/log.controller.ts
import { Controller, Get } from "@nestjs/common";
import { LogDto } from "./log.dto";
import { LogService } from "./log.service";

@Controller("logs")
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  list(): LogDto[] {
    return this.logService.list();
  }
}
