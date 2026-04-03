import type { SignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { mapControllerError } from "../controller-error";

export class SignInController {
  constructor(private readonly useCase: SignInUseCase) {}

  async execute(input: { email: string; password: string }) {
    try {
      const result = await this.useCase.execute(input);
      return {
        status: "success" as const,
        session: result.session,
        redirectTo: "/discover",
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
