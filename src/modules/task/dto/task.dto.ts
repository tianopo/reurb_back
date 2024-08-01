import { IsDateString, IsIn, IsNotEmpty, IsString, Length } from "class-validator";
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
  @IsNotEmpty()
  projeto: string;

  @IsString()
  @IsIn(["A Fazer", "Feito", "Atrasado"])
  status: string;

  @IsNotEmpty()
  userIds: string[];
}
