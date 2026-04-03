import { DomainError } from "./common";

export class MatchRequiredError extends DomainError {
  constructor() {
    super("Only matched users can access this feature.");
  }
}

export class ProfileNotFoundError extends DomainError {
  constructor() {
    super("Profile not found.");
  }
}

export class InvalidLikeError extends DomainError {
  constructor(message = "You cannot like this profile.") {
    super(message);
  }
}
