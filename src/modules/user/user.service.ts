import { CustomError } from "@/exceptions/CustomError.filter";
import { prisma } from "@/prisma/prismaConnection";
import { Injectable } from "@nestjs/common";
import { User } from "./user.dto";

@Injectable()
export class UserService {
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: User) {
    const existEmail = await this.findEmail(data.email)
    if (existEmail) throw new CustomError('E-mail already registered')

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
