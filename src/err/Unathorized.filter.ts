import { HttpException, HttpStatus } from "@nestjs/common";

// cliente não autenticado
export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    console.log(message);
  }
}
