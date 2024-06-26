import { IsNotEmpty, IsString } from "class-validator";

export class LogDto {
  @IsNotEmpty()
  @IsString()
  routeName: string;

  @IsNotEmpty()
  @IsString()
  method: string;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  time: string;
}
