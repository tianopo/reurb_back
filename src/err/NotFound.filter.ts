import { HttpException, HttpStatus } from "@nestjs/common";
// recurso não foi encontrado no servidor
export class NotFound extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
    console.log(message);
  }
}
