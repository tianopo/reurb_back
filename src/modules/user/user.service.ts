import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  async createUser(data: UserDto) {
    await this.validateUniqueFields(data);

    return prisma.user.create({
      data: {
        ...data,
        status: true,
      },
    });
  }

  async createEmployee(data: EmployeeDto) {
    await this.validateUniqueFields(data);
    const senha = await bcrypt.hash("Abcd123!", 10);
    return prisma.user.create({
      data: {
        ...data,
        status: true,
        acesso: Role.Funcionario,
        senha,
        token: "",
      },
    });
  }

  async createClient(data: ClientDto) {
    await this.validateUniqueFields(data);
    const senha = await bcrypt.hash("Abcd123!", 10);
    return prisma.user.create({
      data: {
        ...data,
        status: false,
        acesso: Role.Cliente,
        senha,
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

  async updateRecoverPassword(data: RecoverPasswordDto) {
    const { email, senha } = data;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) throw new CustomError("E-mail não existe");

    const hashedPassword = await bcrypt.hash(senha, 10);
    const updated = new Date();

    return prisma.user.update({
      where: { email },
      data: {
        ...data,
        senha: hashedPassword,
        updated,
      },
    });
  }

  async updateEmployee(id: string, data: EmployeeDto) {
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar.");
    await this.validateUniqueFields(data, id);

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        status: data.status === "Ativado" ? true : false,
      },
    });
  }

  async updateClient(id: string, data: ClientDto) {
    if (!id) throw new CustomError("ID de usuário é obrigatório para atualizar.");
    await this.validateUniqueFields(data, id);

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        status: data.status === "Ativado" ? true : false,
      },
    });
  }

  async list() {
    // const cacheKey = "users";
    // const cache = await redis.get(cacheKey);
    const data = await prisma.user.findMany();
    // cacheStale(cacheKey, data, "dynamic");
    // if (cache) return JSON.parse(cache);
    // await redis.set(cacheKey, JSON.stringify(data));

    return data;
  }

  async getId(id: string) {
    if (!id) throw new CustomError("ID de usuário é obrigatório.");
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new CustomError("Usuário não encontrado.");

    return user;
  }

  async delete(id: string) {
    if (!id) throw new CustomError("Usuário ID é obrigatório");
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
