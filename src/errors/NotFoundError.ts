import { ApplicationError } from "../utils/protocols";

export function NotFoundError(message: string = "Not Found"): ApplicationError {
  return {
    name: 'NotFoundError',
    message, 
  };
}
