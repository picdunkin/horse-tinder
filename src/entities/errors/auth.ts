import { DomainError } from "./common";

export class NotAuthenticatedError extends DomainError {
  constructor() {
    super("You need to sign in to continue.");
  }
}
