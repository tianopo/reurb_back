import { CustomError } from "@/filters/CustomError.exception";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "src/modules/user/user.service";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    if (!email || !password) throw new CustomError("E-mail or password are empty")

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!email) {
      throw new Error("User not find");
    }
    const invalidPassword = await bcrypt.compare(password, user.password);

    if (!invalidPassword) {
      throw new Error("Invalid Password");
    }

    return {
      email,
      token: this.jwtService.sign({ email }),
    };
  }

  async signUp(createDto: RegisterUserDto) {
    const { name, email, password } = createDto;
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      createdIn: new Date(),
      updated: new Date(),
    });

    return {
      name,
      email,
      token: this.jwtService.sign({ email: user.email }),
      createdIn: user.createdIn,
      updated: user.updated
    };
  }
}
