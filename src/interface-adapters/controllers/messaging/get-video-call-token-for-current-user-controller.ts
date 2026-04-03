import type { GetVideoCallTokenForCurrentUserUseCase } from "@/src/application/use-cases/messaging/get-video-call-token-for-current-user";
import { mapControllerError } from "../controller-error";

export class GetVideoCallTokenForCurrentUserController {
  constructor(
    private readonly useCase: GetVideoCallTokenForCurrentUserUseCase,
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
