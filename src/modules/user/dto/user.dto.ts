import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";
import { Role } from "../../../decorators/roles.decorator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../../decorators/validators/regex.decorator";
import { Required } from "../../required.dto";

export class UserDto extends Required {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome: string;

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
  @IsString()
  @Length(1, 255)
  email: string;

  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  acesso: Role;
}
