import { IsNotEmpty, IsString } from "class-validator";

export class ContributionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  valor: string;
}
