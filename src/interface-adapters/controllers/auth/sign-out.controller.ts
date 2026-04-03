import type { SignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { mapControllerError } from "../controller-error";

export class SignOutController {
  constructor(private readonly useCase: SignOutUseCase) {}

  async execute() {
    try {
      await this.useCase.execute();
      return {
        status: "success" as const,
        redirectTo: "/sign-in",
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
