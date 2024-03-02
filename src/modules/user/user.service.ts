import { CustomError } from "@/filters/CustomError.exception";
import { Injectable } from "@nestjs/common";
import { User } from "./user.dto";
import { prisma } from "@/prisma/prismaConnection";

@Injectable()
export class UserService {
  constructor() { }

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
    if (!existEmail) throw new CustomError("Email not found")

    return existEmail
  }
}
