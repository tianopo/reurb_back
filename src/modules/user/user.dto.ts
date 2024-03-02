import { EmailFormat, GetOneLowercase, GetOneNumber, GetOneSpecialCharacter, GetOneUppercase } from "@/decorators/auth.decorator";
import { UUID } from "@/decorators/uuid.decorator";
import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class User {
  @Optional()
  @IsString()
  @UUID()
  id?: string;

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
}
