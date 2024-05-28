import { CustomValidator } from "@/err/custom/Validator.filter";
import { ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class CustomValidationPipe extends ValidationPipe {
  public createExceptionFactory() {
    return (errors: ValidationError[]) => {
      const message = this.flattenValidationErrors(errors)[0];
      return new CustomValidator(message);
    };
  }

  protected flattenValidationErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];
    for (const error of errors) {
      if (error.constraints) {
        messages.push(Object.values(error.constraints)[0]);
      }
      if (error.children && error.children.length > 0) {
        const childMessages = this.flattenValidationErrors(error.children);
        messages.push(...childMessages);
      }
      if (messages.length > 0) {
        break;
      }
    }
    return messages;
  }
}
