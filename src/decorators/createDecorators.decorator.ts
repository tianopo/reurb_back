import { ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";

interface CreateDecoratorsFunction {
  (value: any, args?: ValidationArguments): boolean;
}

interface CreateDecoratorsOptions {
  name: string;
  validationFunction: CreateDecoratorsFunction;
}

export function createCustomValidator({ name, validationFunction }: CreateDecoratorsOptions) {
  return function (object: Object, propertyName: string, validationOptions?: ValidationOptions) {
    registerDecorator({
      name,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return validationFunction(value, args);
        },
      },
    });
  };
}