import { IsDateString, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "A data de criação é obrigatória." })
  @IsDateString({}, { message: "A data de criação deve ser uma string de data válida." })
  createdIn: Date | string;

  @IsNotEmpty({ message: "A data de atualização é obrigatória." })
  @IsDateString({}, { message: "A data de atualização deve ser uma string de data válida." })
  updated: Date | string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 12)
  password: string;
}
