import { Role } from "@/decorators/roles.decorator";
import { UUID } from "@/decorators/validators/uuid.decorator";
import { Nullable } from "@/decorators/validators/nullable.decorator";
import { Optional } from "@nestjs/common";
import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../decorators/validators/regex.decorator";

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

  token: string;

  role: Role[];
}
