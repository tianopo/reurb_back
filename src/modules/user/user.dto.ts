import { Optional } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IsDate } from "class-validator";

export class User implements Prisma.UserCreateInput {
  id?: string;
  @Optional()
  @IsDate()
  createdIn: Date;
  @Optional()
  @IsDate()
  updated = new Date();

  name: string;
  email: string;
  password: string;
}
