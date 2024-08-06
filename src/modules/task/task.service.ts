import { Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { TaskDto } from "./dto/task.dto";
import { TaskUpdateDto } from "./dto/taskUpdate.dto";

@Injectable()
export class TaskService {
  constructor(private readonly tokenService: TokenService) {}

  async create(data: TaskDto) {
    await this.validateUsersExist(data.funcionarios);
    const task = {
      descricao: data.descricao,
      data: new Date(data.data),
      prioridade: data.prioridade,
      projeto: data.projeto,
      status: data.status,
      funcionarios: {
        connect: data.funcionarios.map((funcionario) => ({ id: funcionario })),
      },
    };

    return prisma.task.create({ data: task });
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const funcionario = await this.tokenService.validateToken(token);

    const includefuncionarios = {
      funcionarios: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    };

    if ([Role.Master, Role.Admin].includes(funcionario.acesso))
      return prisma.task.findMany({ include: includefuncionarios });
    else
      return prisma.task.findMany({
        where: {
          funcionarios: {
            some: { id: funcionario.id },
          },
        },
        include: includefuncionarios,
      });
  }

  async findOne(id: string) {
    await this.validateId(id);
    return this.validateTaskExists(id);
  }

  async update(id: string, data: TaskUpdateDto) {
    await this.validateId(id);
    await this.validateTaskExists(id);
    const ids = data.funcionarios.map((f) => f.id);
    if (data.funcionarios && data.funcionarios.length > 0) await this.validateUsersExist(ids);

    return prisma.task.update({
      where: { id },
      data: {
        descricao: data.descricao,
        data: new Date(data.data),
        prioridade: data.prioridade,
        projeto: data.projeto,
        status: data.status,
        funcionarios: {
          connect: data.funcionarios?.map((funcionario) => ({ id: funcionario.id })) || [],
        },
      },
    });
  }

  async remove(id: string) {
    await this.validateId(id);
    return prisma.task.delete({ where: { id } });
  }

  private async validateTaskExists(id: string): Promise<Task> {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw new CustomError("Tarefa não encontrada.");
    return task;
  }

  private async validateUsersExist(funcionarios: string[]): Promise<void> {
    const users = await prisma.user.findMany({
      where: { id: { in: funcionarios } },
    });
    if (users.length !== funcionarios.length) {
      throw new CustomError("Um ou mais usuários não existem.");
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de tarefa é obrigatório.");
  }
}
