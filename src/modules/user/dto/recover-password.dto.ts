import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  EmailFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
} from "../../../decorators/validators/regex.decorator";
import { Required } from "../../required.dto";

export class RecoverPasswordDto extends Required {
  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  senha: string;

  @GetOneUppercase()
  @GetOneLowercase()
  @GetOneSpecialCharacter()
  @GetOneNumber()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  confirmarSenha: string;

  @IsNotEmpty()
  @EmailFormat()
  @IsString()
  @Length(1, 255)
  email: string;
}
