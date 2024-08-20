import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString, Length } from "class-validator";

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
  @IsIn(["Crédito", "Débito", "Boleto", "Dinheiro", "Pix", "Outros", "Automático"])
  pagamento: string;

  @IsString()
  @IsOptional()
  @IsIn(["10", "20", "30", ""])
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
