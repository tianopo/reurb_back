import { Injectable } from "@nestjs/common";
import { prisma } from "../../config/prisma-connection";
import { CustomError } from "../../err/custom/Error.filter";
import { TokenService } from "../token/token.service";
import { TaskDto } from "./dto/task.dto";

@Injectable()
export class TaskService {
  constructor(private readonly tokenService: TokenService) {}
  async create(data: TaskDto) {
    const usersExist = await prisma.user.findMany({
      where: {
        id: { in: data.userIds },
      },
    });

    if (usersExist.length !== data.userIds.length) {
      throw new CustomError(`Um ou mais usuários não existem`);
    }

    const taskData = {
      descricao: data.descricao,
      data: new Date(data.data),
      prioridade: data.prioridade,
      projeto: data.projeto,
      status: data.status,
      connect: data.userIds.map((userId) => ({ id: userId })),
    };

    return prisma.task.create({
      data: taskData,
    });
  }

  async list(authorization: string) {
    const token = authorization.replace("Bearer ", "");
    const user = await this.tokenService.validateToken(token);

    if (user.acesso === "master") {
      return prisma.task.findMany();
    } else {
      return prisma.task.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      });
    }
  }

  findOne(id: string) {
    return prisma.task.findUnique({ where: { id } });
  }

  update(id: string, data: TaskDto) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return prisma.task.delete({ where: { id } });
  }
}
