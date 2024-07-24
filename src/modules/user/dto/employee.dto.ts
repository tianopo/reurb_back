import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";
import { Role } from "../../../decorators/roles.decorator";
import {
  CPFFormat,
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../../decorators/validators/regex.decorator";
import { Required } from "../../required.dto";

export class EmployeeDto extends Required {
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  nome: string;

  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsOptional()
  @IsString()
  @Length(6, 30)
  senha?: string;

  @IsNotEmpty()
  @EmailFormat()
  @IsString()
  @Length(1, 255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  @CPFFormat()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  profissao: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  telefone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  acesso: Role;
}
