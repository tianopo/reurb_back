import { CustomValidator } from "@/exceptions/CustomValidator.filter";
import { isUUID } from 'class-validator';
import { createCustomValidator } from "./createDecorators.decorator";

export const UUID = () => {
  return createCustomValidator({
    name: 'isUUIDCustom',
    validationFunction: (value: any) => {
      const uuid = typeof value === 'string' && isUUID(value);
      if (!uuid) throw new CustomValidator('Invalid ID');
      return uuid;
    },
  });
}
