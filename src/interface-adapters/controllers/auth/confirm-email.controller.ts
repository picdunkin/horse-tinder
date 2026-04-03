import type { ConfirmEmailUseCase } from "@/src/application/use-cases/auth/confirm-email.use-case";
import { mapControllerError } from "../controller-error";

export class ConfirmEmailController {
  constructor(private readonly useCase: ConfirmEmailUseCase) {}

  async execute(input: { code: string }) {
    try {
      const result = await this.useCase.execute(input);
      return {
        status: result.status,
        redirectTo: result.redirectTo,
        message: result.message,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
        redirectTo: "/sign-in",
      };
    }
  }
}
