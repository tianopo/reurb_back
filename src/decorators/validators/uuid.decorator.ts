import { isUUID } from "class-validator";
import { CustomValidator } from "../../err/custom/Validator.filter";
import { CustomCreateValidator } from "../custom/create-validator.decorator";

export const UUID = () => {
  return CustomCreateValidator({
    name: "isUUIDCustom",
    validationFunction: (value: string) => {
      const uuid = typeof value === "string" && isUUID(value);
      if (!uuid) throw new CustomValidator("Invalid ID");
      return uuid;
    },
  });
};
