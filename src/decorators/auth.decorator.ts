import { RegexExp } from "@/utils/regexExp";
import { Regex } from "./common/regex.decorator";

export function GetOneUppercase() {
  return Regex(
    RegexExp.uppercase,
    { message: "Password without a uppercase character" }
  );
}

export function GetOneLowercase() {
  return Regex(
    RegexExp.lowcase,
    { message: "Password without a lowercase characters" }
  );
}

export function GetOneSpecialCharacter() {
  return Regex(
    RegexExp.special_character,
    { message: 'Password without a special character' }
  );
}

export function GetOneNumber() {
  return Regex(
    RegexExp.number,
    { message: "Password without a number" }
  );
}

export function EmailFormat() {
  return Regex(
    RegexExp.email,
    { message: "Invalid E-mail" }
  );
}