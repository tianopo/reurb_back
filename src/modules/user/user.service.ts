import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { redis } from "../../config/redis";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { cacheStale } from "../../utils/cacheStale";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  async createUser(data: UserDto) {
    await this.validateUniqueFields(data);
    const countUser = await this.countUser();
    const firstRole = countUser === 0 ? Role.Admin : Role.Cliente;
    return prisma.user.create({
      data: {
        ...data,
        acesso: firstRole,
      },
    });
  }

  async createEmployee(data: EmployeeDto) {
    await this.validateUniqueFields(data);
    return prisma.user.create({
      data: {
        ...data,
        acesso: Role.Funcionario,
        senha: "12345678",
        token: "",
      },
    });
  }

  async createClient(data: ClientDto) {
    await this.validateUniqueFields(data);
    return prisma.user.create({
      data: {
        ...data,
        acesso: Role.Cliente,
        senha: "12345678",
        token: "",
      },
    });
  }

  async update(id: string, user: UserDto) {
    const { ...data } = user;
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar.");
    const updated = new Date();
    await this.validateUniqueFields(data);

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated,
      },
    });
  }

  async updateEmployee(id: string, data: EmployeeDto) {
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar.");
    await this.validateUniqueFields(data, id);

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateClient(id: string, data: ClientDto) {
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar.");
    await this.validateUniqueFields(data, id);

    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async list() {
    const cache = await redis.get("users");
    const data = await prisma.user.findMany();
    cacheStale("users", data);
    if (cache) return JSON.parse(cache);
    await redis.set("users", JSON.stringify(data));

    return data;
  }

  async delete(id: string) {
    if (!id) throw new CustomError("Usuário ID não foi encontrado");

    return prisma.user.delete({ where: { id } });
  }

  async updateToken(user: User) {
    const { id, ...data } = user;
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar");
    const updated = new Date();

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated,
      },
    });
  }

  async countUser() {
    return prisma.user.count();
  }

  async findToken(token: string) {
    if (token !== "") {
      const existToken = await prisma.user.findFirst({
        where: { token },
      });
      if (!existToken) return undefined;
      return existToken;
    } else return undefined;
  }

  async validateUniqueFields(data: any, userId?: string) {
    const { email, cpf, rg, cpfConjuge, rgConjuge, emailConjuge } = data;

    if (userId) {
      const userIdVerification = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!userIdVerification) throw new CustomError(`ID de funcionário ${userId} não encontrado`);
    }

    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingEmail) throw new CustomError("E-mail já existe");
    }

    if (cpf) {
      const existingCPF = await prisma.user.findFirst({
        where: {
          cpf,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingCPF) throw new CustomError("CPF já foi registrado");
    }

    if (rg) {
      const existingRG = await prisma.user.findFirst({
        where: {
          rg,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingRG) throw new CustomError("RG já foi registrado");
    }

    if (cpfConjuge) {
      const existingCpfConjuge = await prisma.user.findFirst({
        where: {
          cpfConjuge,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingCpfConjuge) throw new CustomError("CPF do cônjuge já foi registrado");
    }

    if (rgConjuge) {
      const existingRgConjuge = await prisma.user.findFirst({
        where: {
          rgConjuge,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingRgConjuge) throw new CustomError("RG do cônjuge já foi registrado");
    }

    if (emailConjuge) {
      const existingEmailConjuge = await prisma.user.findFirst({
        where: {
          emailConjuge,
          AND: userId ? { id: { not: userId } } : undefined,
        },
      });
      if (existingEmailConjuge) throw new CustomError("E-mail do cônjuge já foi registrado");
    }
  }
}
