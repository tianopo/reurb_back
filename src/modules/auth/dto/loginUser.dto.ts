import { GetOneUppercase, GetOneLowercase, GetOneSpecialCharacter, GetOneNumber, EmailFormat } from "@/decorators/auth.decorator";
import { IsNotEmpty, IsString, Length } from "class-validator";

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
