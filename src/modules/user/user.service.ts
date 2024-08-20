import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { UnauthorizedException } from "../../err/Unathorized.filter";
import { TokenService } from "../token/token.service";
import { ClientDto } from "./dto/client.dto";
import { EmployeeDto } from "./dto/employee.dto";
import { RecoverPasswordDto } from "./dto/recover-password.dto";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(private readonly tokenService: TokenService) {}

  async createUser(data: UserDto) {
    await this.validateUniqueFields(data);

    return prisma.user.create({
      data: {
        ...data,
        status: true,
        createdById: "",
      },
    });
  }

  async createEmployee(data: EmployeeDto, authorization: string) {
    await this.validateUniqueFields(data);
    const senha = await bcrypt.hash("Abcd123!", 10);
    const { id } = await this.userData(authorization);

    return prisma.user.create({
      data: {
        ...data,
        status: true,
        acesso: data.acesso === Role.Funcionario ? Role.Funcionario : Role.Admin,
        senha,
        token: "",
        createdById: id,
      },
    });
  }

  async createClient(data: ClientDto, authorization: string) {
    await this.validateUniqueFields(data);
    const senha = await bcrypt.hash("Abcd123!", 10);
    const { id } = await this.userData(authorization);

    return prisma.user.create({
      data: {
        ...data,
        status: false,
        acesso: Role.Cliente,
        senha,
        token: "",
        createdById: id,
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

  async list(authorization: string) {
    const { id, acesso, createdById } = await this.userData(authorization);
    console.log(createdById);
    const including = {
      projetosEmp: {
        select: {
          id: true,
          nome: true,
        },
      },
      projetosCli: {
        select: {
          id: true,
          nome: true,
        },
      },
    };

    if (acesso === Role.Gestor)
      return await prisma.user.findMany({
        include: including,
      });
    else if (acesso === Role.Admin)
      return prisma.user.findMany({
        where: {
          OR: [{ id }, { createdById: id }],
        },
        include: including,
      });
    else if (acesso === Role.Funcionario)
      return prisma.user.findMany({
        where: {
          OR: [{ id }, { createdById }],
        },
        include: including,
      });
    else if (acesso === Role.Cliente)
      return prisma.user.findMany({
        where: { id },
      });
    else throw new UnauthorizedException("Permissão não reconhecida");
  }

  async getId(id: string) {
    if (!id) throw new CustomError("ID de usuário é obrigatório.");
    console.log(id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        projetosEmp: {
          select: {
            id: true,
            nome: true,
          },
        },
        projetosCli: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });
    if (!user) throw new CustomError("Usuário não encontrado.");

    return user;
  }

  async getEmployees() {
    return await prisma.user.findMany({
      where: {
        acesso: Role.Funcionario,
      },
    });
  }

  async getClients() {
    return await prisma.user.findMany({
      where: {
        acesso: Role.Cliente,
      },
    });
  }

  async getClientsAndEmployees() {
    const employeeAndCliente = await prisma.user.findMany({
      where: {
        OR: [{ acesso: Role.Funcionario }, { acesso: Role.Cliente }],
      },
    });
    return employeeAndCliente;
  }

  async delete(userId: string, authorization: string) {
    if (!userId) throw new CustomError("Usuário ID é obrigatório");

    const { id, acesso } = await this.userData(authorization);

    if (acesso === Role.Gestor) throw new CustomError("O gestor não deve se excluir");
    if (userId === id) throw new CustomError("A própria pessoa não deve se excluir");

    return prisma.user.delete({ where: { id: userId } });
  }

  async userData(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);
    const { id, acesso, email, createdById } = user;

    return { id, acesso, email, createdById };
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
