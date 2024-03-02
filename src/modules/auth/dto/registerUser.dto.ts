
import { EmailFormat, GetOneLowercase, GetOneNumber, GetOneSpecialCharacter, GetOneUppercase } from "@/decorators/auth.decorator";
import { Optional } from "@nestjs/common";
import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterUserDto {
  @Optional()
  @IsDate()
  createdIn: Date;

  @Optional()
  @IsDate()
  update: Date;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsString()
  @Length(8, 30)
  password: string;

  @IsNotEmpty()
  @EmailFormat()
  email: string;
}
