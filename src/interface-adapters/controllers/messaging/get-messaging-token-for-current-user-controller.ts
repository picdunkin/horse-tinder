import type { GetMessagingTokenForCurrentUserUseCase } from "@/src/application/use-cases/messaging/get-messaging-token-for-current-user";
import { mapControllerError } from "../controller-error";

export class GetMessagingTokenForCurrentUserController {
  constructor(
    private readonly useCase: GetMessagingTokenForCurrentUserUseCase,
  ) {}

  async execute() {
    try {
      const token = await this.useCase.execute();
      return {
        status: "success" as const,
        token,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
