import { PrismaService } from "@/prisma/prisma.service";
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: User) {
    const existir = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existir) {
      throw new ConflictException('email já existe');
    }

    return this.prisma.user.create({
      data,
    });
  }
}
