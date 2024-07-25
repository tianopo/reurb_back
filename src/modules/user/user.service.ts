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
    const cacheKey = "users";
    const cache = await redis.get(cacheKey);

    const data = await prisma.user.findMany();
    cacheStale(cacheKey, data, "dynamic");

    if (cache) return JSON.parse(cache);
    await redis.set(cacheKey, JSON.stringify(data));

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

    const conditions: any[] = [];

    if (email) conditions.push({ email });
    if (cpf) conditions.push({ cpf });
    if (rg) conditions.push({ rg });
    if (cpfConjuge) conditions.push({ cpfConjuge });
    if (rgConjuge) conditions.push({ rgConjuge });
    if (emailConjuge) conditions.push({ emailConjuge });

    const andConditions: any[] = [];

    if (conditions.length > 0) {
      andConditions.push({ OR: conditions });
    }

    if (userId) {
      andConditions.push({ id: { not: userId } });
    }

    try {
      await prisma.$transaction(async (prisma) => {
        if (userId) {
          const userExists = await prisma.user.findUnique({ where: { id: userId } });
          if (!userExists) throw new CustomError("Id não existe");
        }

        const existingUsers = await prisma.user.findMany({
          where: {
            AND: andConditions.length > 0 ? andConditions : undefined,
          },
        });

        for (const user of existingUsers) {
          if (email && user.email === email) throw new CustomError("E-mail já existe");
          if (cpf && user.cpf === cpf) throw new CustomError("CPF já foi registrado");
          if (rg && user.rg === rg) throw new CustomError("RG já foi registrado");
          if (cpfConjuge && user.cpfConjuge === cpfConjuge)
            throw new CustomError("CPF do cônjuge já foi registrado");
          if (rgConjuge && user.rgConjuge === rgConjuge)
            throw new CustomError("RG do cônjuge já foi registrado");
          if (emailConjuge && user.emailConjuge === emailConjuge)
            throw new CustomError("E-mail do cônjuge já foi registrado");
        }
      });
    } catch (error) {
      throw new CustomError(error.message);
    }
  }
}
