import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/loginUser.dto";
import { RegisterUserDto } from "./dto/registerUser.dto";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signin")
  async login(@Body() data: LoginDto) {
    return this.authService.signIn(data);
  }

  @Post("/signup")
  async cadastro(@Body() data: RegisterUserDto) {
    return this.authService.signUp(data);
  }
}
