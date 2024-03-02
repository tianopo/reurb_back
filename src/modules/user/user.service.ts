import { prisma } from "@/prisma/prismaConnection";
import { Injectable } from "@nestjs/common";
import { User } from "./user.dto";

@Injectable()
export class UserService {
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: User) {
    this.findEmail(data.email)

    return prisma.user.create({
      data,
    });
  }

  async findEmail(email: string) {
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (!existEmail) return undefined
    return existEmail
  }
}
