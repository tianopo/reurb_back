import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomValidator extends HttpException {
  constructor(message: string) {
    const errorMessage = `Validator Error: ${message}`;
    super(message, HttpStatus.BAD_REQUEST);
    console.log(errorMessage);
  }
}