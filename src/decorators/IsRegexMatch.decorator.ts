import { Regex } from "@/utils/regex";
import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsRegexMatch(regex: RegExp, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRegexMatch',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _: ValidationArguments) {
          return regex.test(value);
        },
      },
    });
  };
}
