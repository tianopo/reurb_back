import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../../decorators/validators/regex.decorator";

export class LoginDto {
  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  senha: string;

  @IsNotEmpty()
  @EmailFormat()
  @Length(1, 255)
  @IsString()
  email: string;
}
