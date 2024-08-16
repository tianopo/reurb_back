import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class ContributionDto {
  @IsNotEmpty()
  @IsString()
  valor: string;

  @IsNotEmpty()
  @IsString()
  entrada: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 2)
  parcelas: string;

  @IsNotEmpty()
  @IsString()
  valorParcela: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;
}
