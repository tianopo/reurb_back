import { createCustomValidator } from "./createDecorators.decorator";

export const Nullable = () => {
  return createCustomValidator({
    name: 'nullable',
    validationFunction: (value: any) => value === null || value === undefined || value === ""
  })
}
