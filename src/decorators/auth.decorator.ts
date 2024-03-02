import { Regex } from "@/utils/regex";

export function GetOneUppercase() {
  return Regex(
    Regex.uppercase,
    { message: "Password without a uppercase character" }
  );
}

export function GetOneLowercase() {
  return Regex(
    Regex.lowcase,
    { message: "Password without a lowercase characters" }
  );
}

export function GetOneSpecialCharacter() {
  return Regex(
    Regex.special_character,
    { message: 'Password without a special character' }
  );
}

export function GetOneNumber() {
  return Regex(
    Regex.number,
    { message: "Password without a number" }
  );
}

export function EmailFormat() {
  return Regex(
    Regex.email,
    { message: "Invalid E-mail" }
  );
}