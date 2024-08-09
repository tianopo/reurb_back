import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { DateHourFormat } from "../../../decorators/validators/regex.decorator";
import { Required } from "../../required.dto";

export class TaskUpdateDto extends Required {
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  descricao: string;

  @IsDateString()
  @IsNotEmpty()
  @DateHourFormat()
  data: string;

  @IsString()
  @IsIn(["Alta", "Media", "Baixa"])
  prioridade: string;

  @IsOptional()
  @IsString()
  projetoId?: string;

  @IsString()
  projeto?: string;

  @IsString()
  @IsIn(["à Fazer", "Atrasados", "Feitos"])
  status: string;

  @IsArray()
  funcionarios?: {
    id: string;
    nome: string;
    email: string;
  }[];
}
