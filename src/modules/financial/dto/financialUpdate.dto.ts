import { IsIn, IsNotEmpty, IsObject, IsString, Length } from "class-validator";

export class FinancialUpdateDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 7)
  @IsIn(["Entrada", "Saída"])
  tipo: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  valor: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @IsIn(["Lançamentos", "Em Processo", "Concluidos"])
  status: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  pagamento: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  vencimento: string;

  @IsObject()
  contribution?: {
    id: string;
    nome: string;
  };

  @IsObject()
  cliente?: {
    id: string;
    nome: string;
  };
}
