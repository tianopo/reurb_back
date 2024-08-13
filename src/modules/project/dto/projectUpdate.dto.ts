import { IsArray, IsDateString, IsIn, IsNotEmpty, IsString } from "class-validator";
import { ContributionDto } from "./contribution.dto";

export class ProjectUpdateDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsString()
  @IsNotEmpty()
  valorTotal: string;

  @IsString()
  @IsNotEmpty()
  valorAcumulado: string;

  @IsDateString()
  @IsNotEmpty()
  @IsDateString()
  dataInicio: string;

  @IsString()
  @IsIn(["Aberto", "Progresso", "Concluido"])
  status?: string;

  @IsArray()
  funcionarios?: {
    id: string;
    nome: string;
  }[];

  @IsArray()
  clientes?: {
    id: string;
    nome: string;
  }[];

  @IsArray()
  contributions?: ContributionDto[];
}
