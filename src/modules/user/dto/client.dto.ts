import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";
import { Role } from "../../../decorators/roles.decorator";
import {
  CEPFormat,
  CPFFormat,
  GetOneLowercase,
  GetOneNumber,
  GetOneSpecialCharacter,
  GetOneUppercase,
  RGFormat,
} from "../../../decorators/validators/regex.decorator";
import { Required } from "../../required.dto";

type TipoDeContrato = "Procuração" | "Contrato" | "Requerimento Reurb" | "Memorando";
type EstadoCivil = "Solteiro" | "Casado" | "União Estável" | "Separado" | "Divorciado" | "Viúvo";

export class ClientDto extends Required {
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
  @IsString()
  @MaxLength(20)
  tiposDeContrato: TipoDeContrato;

  @IsNotEmpty()
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

  acesso: Role;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  @RGFormat()
  rg: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  estadoCivil: EstadoCivil;

  @IsNotEmpty()
  @IsString()
  @CEPFormat()
  @MaxLength(20)
  cep: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  rua: string;

  @IsString()
  @MaxLength(25)
  numero?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bairro: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  complemento?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  estado: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  loteAtual?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  loteNovo?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  quadraAtual?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  quadraNova?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  totalRendaFamiliar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  nomeConjuge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  @RGFormat()
  rgConjuge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(14)
  @CPFFormat()
  cpfConjuge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  profissaoConjuge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefoneConjuge?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  emailConjuge?: string;
}
