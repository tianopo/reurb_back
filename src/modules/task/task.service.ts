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
      projeto: data.projetoId ? { connect: { id: data.projetoId } } : undefined,
      status: data.status,
      funcionarios: {
        connect: data.funcionarios.map((funcionario) => ({ id: funcionario })),
      },
    };

    return prisma.task.create({ data: task });
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);

    const including = {
      funcionarios: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
      projeto: {
        select: {
          id: true,
          nome: true,
        },
      },
    };

    if ([Role.Gestor, Role.Admin].includes(user.acesso))
      return prisma.task.findMany({ include: including });
    else
      return prisma.task.findMany({
        where: {
          funcionarios: {
            some: { id: user.id },
          },
        },
        include: including,
      });
  }

  async findOne(id: string) {
    await this.validateId(id);
    return this.validateTaskExists(id);
  }

  async update(id: string, task: TaskUpdateDto) {
    const { descricao, data, prioridade, projeto, status, funcionarios } = task;

    await this.validateId(id);
    await this.validateTaskExists(id);

    const updatedTask = await prisma.$transaction(async (prisma) => {
      const existingTask = await prisma.task.findUnique({ where: { id } });

      const isDescriptionImmutable =
        /.* - Parcela \d+$/.test(existingTask.descricao) || /Entrada/.test(existingTask.descricao);
      if (isDescriptionImmutable && existingTask.descricao !== descricao)
        throw new CustomError(
          "A descrição da tarefa não pode ser alterada se foi criada pelo Projeto",
        );

      if (funcionarios && funcionarios.length > 0) {
        const ids = funcionarios.map((f) => f.id);
        await this.validateUsersExist(ids);
      }

      const utcDate = new Date(data);
      utcDate.setHours(utcDate.getHours() - 3);

      return prisma.task.update({
        where: { id },
        data: {
          descricao: descricao,
          data: utcDate,
          prioridade: prioridade,
          projeto: projeto ? { connect: { id: projeto.id } } : { disconnect: true },
          status: status,
          funcionarios: {
            set:
              funcionarios?.length > 0
                ? funcionarios.map((funcionario) => ({ id: funcionario.id }))
                : [],
          },
        },
      });
    });

    return updatedTask;
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
