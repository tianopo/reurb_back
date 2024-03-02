import { Regex } from "@/utils/regex";
import { IsRegexMatch } from "./IsRegexMatch.decorator";

export function GetOneUppercase() {
  return IsRegexMatch(
    Regex.uppercase,
    { message: "Password without a uppercase character" }
  );
}

export function GetOneLowercase() {
  return IsRegexMatch(
    Regex.lowcase,
    { message: "Password without a lowercase characters" }
  );
}

export function GetOneSpecialCharacter() {
  return IsRegexMatch(
    Regex.special_character,
    { message: 'Password without a special character' }
  );
}

export function GetOneNumber() {
  return IsRegexMatch(
    Regex.number,
    { message: "Password without a number" }
  );
}

export function EmailFormat() {
  return IsRegexMatch(
    Regex.email,
    { message: "Invalid E-mail" }
  );
}