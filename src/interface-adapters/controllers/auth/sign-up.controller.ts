import type { SignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { mapControllerError } from "../controller-error";

export class SignUpController {
  constructor(private readonly useCase: SignUpUseCase) {}

  async execute(input: {
    email: string;
    password: string;
    emailRedirectTo: string;
  }) {
    try {
      const result = await this.useCase.execute(input);
      return {
        status: "success" as const,
        requiresEmailConfirmation: result.requiresEmailConfirmation,
        message: result.requiresEmailConfirmation
          ? "Check your email for a confirmation link."
          : "Account created.",
        redirectTo: result.requiresEmailConfirmation ? "/confirm" : "/profile/edit",
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
