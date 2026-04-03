import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ValidationError } from "@/src/entities/errors/common";
import {
  InvalidLikeError,
  MatchRequiredError,
  ProfileNotFoundError,
} from "@/src/entities/errors/dating";

export function mapControllerError(error: unknown) {
  if (error instanceof NotAuthenticatedError) {
    return {
      code: "not_authenticated",
      message: error.message,
    };
  }

  if (error instanceof ProfileNotFoundError) {
    return {
      code: "profile_not_found",
      message: error.message,
    };
  }

  if (error instanceof MatchRequiredError) {
    return {
      code: "match_required",
      message: error.message,
    };
  }

  if (error instanceof InvalidLikeError || error instanceof ValidationError) {
    return {
      code: "validation_error",
      message: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unexpected_error",
      message: error.message,
    };
  }

  return {
    code: "unexpected_error",
    message: "Something went wrong.",
  };
}
