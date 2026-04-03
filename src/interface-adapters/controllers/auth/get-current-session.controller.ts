import type { GetCurrentSessionUseCase } from "@/src/application/use-cases/auth/get-current-session.use-case";
import { mapControllerError } from "../controller-error";

export class GetCurrentSessionController {
  constructor(private readonly useCase: GetCurrentSessionUseCase) {}

  async execute() {
    try {
      const session = await this.useCase.execute();
      return {
        status: "success" as const,
        session,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
