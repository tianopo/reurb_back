import { User } from "@/modules/user/user.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "src/modules/user/user.service";
import { CadastroUserDto } from "./dto/cadastro-user.dto";
import { LoginDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!email) {
      throw new Error("usuário não encontrado");
    }
    const invalidPassword = await bcrypt.compare(password, user.password);

    if (!invalidPassword) {
      throw new Error("Invalid Password");
    }

    return {
      token: this.jwtService.sign({ email }),
    };
  }

  async cadastrar(criarDto: CadastroUserDto) {
    const criarUsuario = new User();
    criarUsuario.nome = criarDto.nome;
    criarUsuario.email = criarDto.email;
    criarUsuario.password = await bcrypt.hash(criarDto.password, 10);
    criarUsuario.criadoEm = new Date();
    criarUsuario.atualizadoEm = new Date();

    const user = await this.userService.create(criarUsuario);

    return {
      token: this.jwtService.sign({ email: user.email }),
    };
  }
}
