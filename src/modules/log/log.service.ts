import { Injectable } from "@nestjs/common";
import { LogDto } from "./log.dto";

@Injectable()
export class LogService {
  private logs: LogDto[] = [];

  create(log: LogDto) {
    this.logs.push({ ...log });
    if (this.logs.length >= 10) this.logs.splice(0, 10);
  }

  list(): LogDto[] {
    return this.logs;
  }
}
