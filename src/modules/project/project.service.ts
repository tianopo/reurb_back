import { Injectable } from "@nestjs/common";
import { Project } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { ProjectDto } from "./dto/project.dto";

@Injectable()
export class ProjectService {
  constructor(private readonly tokenService: TokenService) {}
  async create(data: ProjectDto) {
    const { nome, descricao, valorTotal, valorAcumulado, funcionarios, clientes, contribuicoes } =
      data;

    await this.validateUsersExist(funcionarios, clientes);
    const create = await prisma.project.create({
      data: {
        nome,
        descricao,
        valorTotal,
        valorAcumulado,
        funcionarios: {
          connect: funcionarios?.map((funcionario) => ({ id: funcionario })),
        },
        clientes: {
          connect: clientes?.map((cliente) => ({ id: cliente })),
        },
        contributions: {
          create: contribuicoes?.map((contribution) => ({
            valor: contribution.valor,
            user: {
              connect: { id: contribution.userId },
            },
          })),
        },
      },
    });

    return create;
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);

    if ([Role.Gestor, Role.Admin].includes(user.acesso)) {
      return prisma.project.findMany();
    } else if (user.acesso === Role.Cliente) {
      return prisma.user.findMany({
        where: {
          projetosCli: {
            some: { id: user.id },
          },
        },
      });
    } else if (user.acesso === Role.Funcionario) {
      return prisma.project.findMany({
        where: {
          funcionarios: {
            some: { id: user.id },
          },
        },
      });
    } else {
      throw new CustomError("Acesso não autorizado");
    }
  }

  async getId(id: string) {
    await this.validateId(id);
    return this.validateProjectExists(id);
  }

  async update(id: string, data: ProjectDto) {
    const { nome, descricao, valorTotal, valorAcumulado, funcionarios, clientes, contribuicoes } =
      data;

    await this.validateId(id);
    await this.validateProjectExists(id);
    const funcionarioIds = funcionarios.map((f) => f);
    const clienteIds = clientes.map((c) => c);
    if (funcionarios.length > 0 || clientes.length > 0)
      await this.validateUsersExist(funcionarioIds, clienteIds);

    const update = await prisma.project.update({
      where: { id },
      data: {
        nome,
        descricao,
        valorTotal,
        valorAcumulado,
        funcionarios: {
          connect: funcionarios?.map((funcionario) => ({ id: funcionario })),
        },
        clientes: {
          connect: clientes?.map((cliente) => ({ id: cliente })),
        },
        contributions: {
          deleteMany: {},
          create: contribuicoes?.map((contribution) => ({
            valor: contribution.valor,
            user: {
              connect: { id: contribution.userId },
            },
          })),
        },
      },
    });

    return update;
  }

  async remove(id: string) {
    await this.validateId(id);
    return prisma.project.delete({
      where: { id },
    });
  }

  private async validateProjectExists(id: string): Promise<Project> {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new CustomError("Projeto não encontrado.");
    return project;
  }

  private async validateUsersExist(
    funcionarios: string[] = [],
    clientes: string[] = [],
  ): Promise<void> {
    const allIds = [...new Set([...funcionarios, ...clientes])];

    const users = await prisma.user.findMany({
      where: { id: { in: allIds } },
      select: { id: true },
    });

    const existingUserIds = new Set(users.map((user) => user.id));

    const missingFuncionarios = funcionarios.filter((id) => !existingUserIds.has(id));
    const missingClientes = clientes.filter((id) => !existingUserIds.has(id));

    if (missingFuncionarios.length > 0 || missingClientes.length > 0) {
      let errorMessage = "";

      if (missingFuncionarios.length > 0)
        errorMessage += `Funcionários não encontrados: ${missingFuncionarios.join(", ")}. `;
      if (missingClientes.length > 0)
        errorMessage += `Clientes não encontrados: ${missingClientes.join(", ")}.`;

      throw new CustomError(errorMessage.trim());
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de Projeto é obrigatório.");
  }
}
