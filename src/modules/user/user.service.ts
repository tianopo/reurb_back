import { Role } from "@/decorators/roles.decorator";
import { CustomError } from "@/err/custom/Error.filter";
import { prisma } from "@/prisma/prisma-connection";
import { Injectable } from "@nestjs/common";
import { User } from "./user.dto";

@Injectable()
export class UserService {
  async findAll() {
    return prisma.user.findMany();
  }

  async create(data: User) {
    const existEmail = await this.findEmail(data.email);
    if (existEmail) throw new CustomError("E-mail already registered");

    const countUser = await this.countUser();
    const firstRole = countUser === 0 ? Role.Admin : Role.User;
    return prisma.user.create({
      data: {
        ...data,
        role: firstRole,
      },
    });
  }

  async findEmail(email: string) {
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (!existEmail) return undefined;
    return existEmail;
  }

  async countUser() {
    return prisma.user.count();
  }

  async findToken(token: string) {
    if (token !== "") {
      const existToken = await prisma.user.findFirst({
        where: { token },
      });

      if (!existToken) throw new CustomError("There is no existing token");
      return existToken;
    } else return undefined;
  }

  async update(user: User) {
    const { id, ...data } = user;
    if (!id) throw new CustomError("User ID is required for updating.");
    const updated = new Date();

    return prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated,
      },
    });
  }
}
