import { EmailFormat, GetOneLowercase, GetOneNumber, GetOneSpecialCharacter, GetOneUppercase } from "@/decorators/auth.decorator";
import { Nullable } from "@/decorators/common/nullable.decorator";
import { UUID } from "@/decorators/common/uuid.decorator";
import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class User {
  @Optional()
  @IsString()
  @UUID()
  @Nullable()
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
