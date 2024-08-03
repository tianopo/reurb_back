import { IsArray, IsDateString, IsIn, IsNotEmpty, IsString, Length } from "class-validator";
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

  @IsString()
  projeto?: string;

  @IsString()
  @IsIn(["à Fazer", "Atrasados", "Feitos"])
  status: string;

  @IsArray()
  funcionarios?: string[];
}
