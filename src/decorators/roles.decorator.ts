import { SetMetadata } from "@nestjs/common";

export enum Role {
  Cliente = "cliente",
  Funcionario = "funcionário",
  Admin = "admin",
  Master = "master",
}

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
