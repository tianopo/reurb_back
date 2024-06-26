import { HttpException, HttpStatus } from "@nestjs/common";
export class BadRequest extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
    console.log(message);
  }
}
