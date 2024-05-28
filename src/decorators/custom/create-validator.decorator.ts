import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

type value = string | null | undefined;
interface CreateDecoratorsFunction {
  (value: value, args?: ValidationArguments): boolean;
}

interface CreateDecoratorsOptions {
  name: string;
  validationFunction: CreateDecoratorsFunction;
}

export function CustomCreateValidator({ name, validationFunction }: CreateDecoratorsOptions) {
  return function (object: object, propertyName: string, validationOptions?: ValidationOptions) {
    registerDecorator({
      name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: value, args: ValidationArguments) {
          return validationFunction(value, args);
        },
      },
    });
  };
}
