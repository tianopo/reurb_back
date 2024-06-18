import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../decorators/validators/regex.decorator";
import { UserFields } from "../user-fields.dto";
import { Role } from "../../decorators/roles.decorator";

export class User extends UserFields {
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

  role: Role;
}
