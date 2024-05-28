import { CustomCreateValidator } from "../custom/create-validator.decorator";

export const Nullable = () => {
  return CustomCreateValidator({
    name: "nullable",
    validationFunction: (value: string | null | undefined) =>
      value === null || value === undefined || value === "",
  });
};
