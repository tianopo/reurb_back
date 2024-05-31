import { Nullable } from "@/decorators/validators/nullable.decorator";
import { UUID } from "@/decorators/validators/uuid.decorator";
import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export class UserFields {
  @Optional()
  @IsString()
  @UUID()
  @Nullable()
  id?: string;

  @Optional()
  createdIn?: Date;

  @Optional()
  updated?: Date;
}
