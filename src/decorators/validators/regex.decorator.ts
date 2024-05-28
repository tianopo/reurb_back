import { RegexExp } from "@/utils/regex-exp";
import { CustomCreateRegex } from "../custom/create-regex.decorator";

const createRegexDecorator = (regex: RegExp, message: string) =>
  CustomCreateRegex(regex, { message });

export const GetOneUppercase = () =>
  createRegexDecorator(RegexExp.uppercase, "Password without an uppercase character");
export const GetOneLowercase = () =>
  createRegexDecorator(RegexExp.lowercase, "Password without a lowercase character");
export const GetOneSpecialCharacter = () =>
  createRegexDecorator(RegexExp.special_character, "Password without a special character");
export const GetOneNumber = () =>
  createRegexDecorator(RegexExp.number, "Password without a number");
export const EmailFormat = () => createRegexDecorator(RegexExp.email, "Invalid E-mail");
export const DateFormat = () => createRegexDecorator(RegexExp["DD/MM/YYYY"], "Invalid date format");
export const RGFormat = () => createRegexDecorator(RegexExp.rg_mask, "Invalid RG format");
export const PhoneFormat = () => createRegexDecorator(RegexExp.phone_mask, "Invalid phone format");
export const CellphoneFormat = () =>
  createRegexDecorator(RegexExp.cellphone_mask, "Invalid cellphone format");
export const CEPFormat = () => createRegexDecorator(RegexExp.cep_mask, "Invalid CEP format");
export const CPFFormat = () => createRegexDecorator(RegexExp.cpf_mask, "Invalid CPF format");
export const CNPJFormat = () => createRegexDecorator(RegexExp.cnpj_mask, "Invalid CNPJ format");
