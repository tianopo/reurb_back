import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../auth.decorator";

export class LoginDto {
  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsNotEmpty()
  @IsString()
  @Length(8, 30)
  password: string;

  @IsNotEmpty()
  @EmailFormat()
  email: string;
}
