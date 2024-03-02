import { HttpException, HttpStatus } from "@nestjs/common";

// cliente está autenticado, mas não tem permissão
export class ForbiddenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
    console.log(message)
  }
}