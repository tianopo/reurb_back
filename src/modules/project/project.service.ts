import { Injectable } from "@nestjs/common";
import { Project } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { ProjectDto } from "./dto/project.dto";
import { ProjectUpdateDto } from "./dto/projectUpdate.dto";

@Injectable()
export class ProjectService {
  constructor(private readonly tokenService: TokenService) {}
  async create(data: ProjectDto) {
    const {
      nome,
      descricao,
      valorTotal,
      valorAcumulado,
      dataInicio,
      status,
      funcionarios,
      clientes,
      contribuicoes,
    } = data;
    await this.validateAcumulateTotal(valorAcumulado, valorTotal);
    await this.validateUsersExist(funcionarios, clientes);

    const create = await prisma.project.create({
      data: {
        nome,
        descricao,
        valorTotal,
        valorAcumulado,
        dataInicio,
        status,
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

    const including = {
      funcionarios: {
        select: {
          id: true,
          nome: true,
        },
      },
      clientes: {
        select: {
          id: true,
          nome: true,
        },
      },
      contributions: {
        select: {
          userId: true,
          valor: true,
        },
      },
    };

    if ([Role.Gestor, Role.Admin].includes(user.acesso)) {
      return prisma.project.findMany({
        include: {
          funcionarios: including.funcionarios,
          clientes: including.clientes,
          contributions: including.contributions,
        },
      });
    } else if (user.acesso === Role.Cliente) {
      return prisma.user.findMany({
        where: {
          projetosCli: {
            some: { id: user.id },
          },
        },
        include: {
          projetosCli: {
            include: including,
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
        include: {
          funcionarios: including.funcionarios,
          clientes: including.clientes,
          contributions: including.contributions,
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

  async update(id: string, data: ProjectUpdateDto) {
    const {
      nome,
      descricao,
      valorTotal,
      valorAcumulado,
      status,
      dataInicio,
      funcionarios,
      clientes,
      contributions,
    } = data;
    await this.validateAcumulateTotal(valorAcumulado, valorTotal);
    await this.validateId(id);
    await this.validateProjectExists(id);

    if (funcionarios.length > 0 || clientes.length > 0) {
      const funcionarioIds = funcionarios.map((f) => f.id);
      const clienteIds = clientes.map((c) => c.id);
      await this.validateUsersExist(funcionarioIds, clienteIds);
    }

    const update = await prisma.project.update({
      where: { id },
      data: {
        nome,
        descricao,
        valorTotal,
        valorAcumulado,
        status,
        dataInicio,
        funcionarios: {
          set:
            funcionarios?.length > 0
              ? funcionarios.map((funcionario) => ({ id: funcionario.id }))
              : [],
        },
        clientes: {
          set: clientes?.length > 0 ? clientes.map((cliente) => ({ id: cliente.id })) : [],
        },
        contributions: {
          deleteMany: {},
          create: contributions?.map((contribution) => ({
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

  private async validateAcumulateTotal(valorAcumulado: string, valorTotal: string) {
    const acumulado = Number(valorAcumulado.replace("R$", "").replace(/\./g, "").replace(",", ""));
    const total = Number(valorTotal.replace("R$", "").replace(/\./g, "").replace(",", ""));
    if (acumulado > total)
      throw new CustomError("Valor acumulado não pode ser maior que valor total");
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
