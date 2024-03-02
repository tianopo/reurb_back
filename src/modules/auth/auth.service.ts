import { CustomError } from "@/exceptions/CustomError.filter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserService } from "src/modules/user/user.service";
import { LoginDto } from "./dto/loginUser.dto";
import { RegisterUserDto } from "./dto/registerUser.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findEmail(email);
    if (!user) throw new CustomError("Email not found")

    const invalidPassword = await bcrypt.compare(password, user.password);
    if (!invalidPassword) throw new Error("Invalid Password");

    return {
      email,
      token: this.jwtService.sign({ email }),
    };
  }

  async signUp(createDto: RegisterUserDto) {
    const { name, email, password } = createDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      name,
      email,
      password: hashedPassword,
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
