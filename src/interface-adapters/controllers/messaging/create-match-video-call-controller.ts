import type { CreateMatchVideoCallUseCase } from "@/src/application/use-cases/messaging/create-match-video-call";
import { mapControllerError } from "../controller-error";

export class CreateMatchVideoCallController {
  constructor(private readonly useCase: CreateMatchVideoCallUseCase) {}

  async execute(input: { otherUserId: string }) {
    try {
      const call = await this.useCase.execute(input.otherUserId);
      return {
        status: "success" as const,
        call,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
