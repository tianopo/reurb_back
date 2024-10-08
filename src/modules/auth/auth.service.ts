import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { prisma } from "../../config/prisma-connection";
import { Role } from "../../decorators/roles.decorator";
import { CustomError } from "../../err/custom/Error.filter";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    const user = await prisma.user.findFirst({
      where: { email: loginDto.email },
    });
    if (!user) throw new CustomError("Email não encontrado");
    if (!user.status && !["Gestor", "Admin"].includes(user.acesso))
      throw new CustomError("Seu cadastro está desativado");

    const invalidPassword = await bcrypt.compare(senha, user.senha);
    if (!invalidPassword) throw new CustomError("Senha inválida");

    const token = this.jwtService.sign({
      email,
      id: user.id,
      acesso: user.acesso,
      createdById: user.createdById,
    });

    await this.userService.updateToken({
      ...user,
      acesso: user.acesso as Role,
      token,
    });

    return {
      email,
      acesso: user.acesso,
      token,
    };
  }

  async signUp(createDto: RegisterUserDto) {
    const { nome, email, senha } = createDto;

    const countUser = await this.userService.countUser();
    const acesso = countUser === 0 ? Role.Gestor : Role.Cliente;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await this.userService.createUser({
      nome,
      email,
      token: "token provisório",
      senha: hashedPassword,
      acesso,
    });

    const token = this.jwtService.sign({
      email,
      id: user.id,
      acesso: user.acesso,
      createdById: user.createdById,
    });

    return {
      email,
      acesso,
      token,
    };
  }

  async logout(token: string) {
    const user = await this.userService.findToken(token);

    if (user)
      await this.userService.updateToken({
        ...user,
        acesso: user.acesso as Role,
        token: "",
      });
    else return false;
    return true;
  }
}
