import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomError } from "../../err/custom/Error.filter";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(email: string) {
    const secret = process.env.JWT_SECRET;
    return this.jwtService.sign({ email }, { secret });
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      if (!payload) throw new CustomError("Tipo de token inválido");
      return payload;
    } catch (error) {
      throw new CustomError("´Token inválido ou expirado");
    }
  }
}
