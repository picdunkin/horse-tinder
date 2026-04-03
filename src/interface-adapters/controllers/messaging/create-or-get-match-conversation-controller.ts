import type { CreateOrGetMatchConversationUseCase } from "@/src/application/use-cases/messaging/create-or-get-match-conversation";
import { mapControllerError } from "../controller-error";

export class CreateOrGetMatchConversationController {
  constructor(
    private readonly useCase: CreateOrGetMatchConversationUseCase,
  ) {}

  async execute(input: { otherUserId: string }) {
    try {
      const result = await this.useCase.execute(input.otherUserId);
      return {
        status: "success" as const,
        conversation: result,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
