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

export class TaskDto extends Required {
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
  @IsIn(["à Fazer", "Atrasados", "Feitos"])
  status: string;

  @IsOptional()
  @IsArray()
  funcionarios?: string[];
}
