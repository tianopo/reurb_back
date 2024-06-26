import { Injectable } from "@nestjs/common";
import { LogDto } from "./log.dto";

@Injectable()
export class LogService {
  private logs: LogDto[] = [];

  create(log: LogDto) {
    this.logs.push({ ...log });
  }

  list(): LogDto[] {
    return this.logs;
  }
}
