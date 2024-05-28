import { HttpException, HttpStatus } from "@nestjs/common";
// recurso não foi encontrado no servidor
export class InternalServerError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    console.log(message);
  }
}
