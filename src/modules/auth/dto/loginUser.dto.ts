import { IsNotEmpty, IsString, Length } from "class-validator";
import { GetOneUppercase, GetOneLowercase, GetOneSpecialCharacter, GetOneNumber, EmailFormat } from "../auth.decorator";

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
