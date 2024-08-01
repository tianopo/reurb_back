import { Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { TaskDto } from "./dto/task.dto";

@Injectable()
export class TaskService {
  constructor(private readonly tokenService: TokenService) {}

  async create(data: TaskDto) {
    await this.validateUsersExist(data.userIds);

    const task = {
      descricao: data.descricao,
      data: new Date(data.data),
      prioridade: data.prioridade,
      projeto: data.projeto,
      status: data.status,
      users: {
        connect: data.userIds.map((userId) => ({ id: userId })),
      },
    };

    return prisma.task.create({ data: task });
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);

    const includeUsers = {
      users: {
        select: {
          id: true,
          nome: true,
          email: true,
        },
      },
    };

    if (user.acesso === Role.Master) return prisma.task.findMany({ include: includeUsers });
    else
      return prisma.task.findMany({
        where: {
          users: {
            some: { id: user.id },
          },
        },
        include: includeUsers,
      });
  }

  async findOne(id: string) {
    await this.validateId(id);
    return this.validateTaskExists(id);
  }

  async update(id: string, data: TaskDto) {
    await this.validateId(id);
    await this.validateTaskExists(id);

    if (data.userIds && data.userIds.length > 0) await this.validateUsersExist(data.userIds);

    return prisma.task.update({
      where: { id },
      data: {
        descricao: data.descricao,
        data: new Date(data.data),
        prioridade: data.prioridade,
        projeto: data.projeto,
        status: data.status,
        users: {
          connect: data.userIds?.map((userId) => ({ id: userId })) || [],
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

  private async validateUsersExist(userIds: string[]): Promise<void> {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new CustomError("Um ou mais usuários não existem.");
    }
  }

  private async validateId(id: string): Promise<void> {
    if (!id) throw new CustomError("ID de tarefa é obrigatório.");
  }
}
