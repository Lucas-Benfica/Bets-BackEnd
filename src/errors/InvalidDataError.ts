import { ApplicationError } from "../utils/protocols";

export function InvalidDataError(message: string): ApplicationError {
  return {
    name: 'InvalidDataError',
    message, 
  };
}
