import { SetMetadata } from "@nestjs/common";

export enum Role {
  Cliente = "Cliente",
  Funcionario = "Funcionário",
  Admin = "Admin",
  Gestor = "Gestor",
}

export const ROLES_KEY = "acesso";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
