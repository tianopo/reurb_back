import { IsNotEmpty, IsString, Length } from "class-validator";
import {
  CEPFormat,
  EmailFormat,
  PhoneFormat,
} from "../../../decorators/validators/regex.decorator";

export class ReceiveMembershipDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @EmailFormat()
  email: string;

  @IsNotEmpty()
  @IsString()
  @PhoneFormat()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @CEPFormat()
  CEP: string;
}
