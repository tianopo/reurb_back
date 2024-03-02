import { CustomError } from "@/filters/CustomError.exception";
import { Regex } from "@/utils/regex";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "src/modules/user/user.service";
import { LoginDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    if (!email || !password) throw new CustomError("Some attribute is empty")

    const user = await this.userService.findEmail(email);
    if (!user) throw new CustomError("Email not found")

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
    if (!name || !email || !password) throw new CustomError("Some attribute is empty")
    if (!Regex.email.test(email)) throw new CustomError('Invalid E-mail')

    const existEmail = await this.userService.findEmail(email)
    if (existEmail) throw new CustomError('E-mail already registered')

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
