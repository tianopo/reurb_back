import { IsArray, IsDateString, IsNotEmpty, IsString } from "class-validator";
import { ContributionDto } from "./contribution.dto";
import { DateHourFormat } from "../../../decorators/validators/regex.decorator";

export class ProjectDto {
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
  @DateHourFormat()
  data: string;

  @IsArray()
  funcionarios?: string[];

  @IsArray()
  clientes?: string[];

  @IsArray()
  contribuicoes: ContributionDto[];
}
