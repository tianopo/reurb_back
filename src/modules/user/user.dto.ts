import { Prisma } from "@prisma/client";

export class User implements Prisma.UserCreateInput {
  name: string;
  id?: string;
  criadoEm: Date | string;
  atualizadoEm: Date | string;
  nome: string;
  email: string;
  password: string;
}
