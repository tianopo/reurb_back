import { Optional } from "@nestjs/common";
import { Nullable } from "../decorators/validators/nullable.decorator";

export class Required {
  @Optional()
  @Nullable()
  id?: string;

  @Optional()
  createdIn?: Date;

  @Optional()
  updated?: Date;
}
