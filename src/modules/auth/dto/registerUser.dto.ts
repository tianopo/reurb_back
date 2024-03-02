
import { Role } from "@/decorators/roles.decorator";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { EmailFormat, GetOneLowercase, GetOneNumber, GetOneSpecialCharacter, GetOneUppercase } from "../auth.decorator";

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

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

  role: Role[]
}
