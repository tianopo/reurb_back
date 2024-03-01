import { Prisma } from "@prisma/client";

export class User implements Prisma.UserCreateInput {
  id?: string;
  createdIn: Date | string;
  updated: Date | string;

  name: string;
  email: string;
  password: string;
}
