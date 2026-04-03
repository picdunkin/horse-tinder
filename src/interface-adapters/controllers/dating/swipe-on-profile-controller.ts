import type { SwipeOnProfileUseCase } from "@/src/application/use-cases/dating/swipe-on-profile";
import { mapControllerError } from "../controller-error";
import { toMatchListItemViewModel } from "../view-models";

export class SwipeOnProfileController {
  constructor(private readonly useCase: SwipeOnProfileUseCase) {}

  async execute(input: { targetUserId: string }) {
    try {
      const result = await this.useCase.execute(input.targetUserId);
      return {
        status: "success" as const,
        isMatch: result.isMatch,
        matchedProfile: result.matchedProfile
          ? toMatchListItemViewModel(result.matchedProfile)
          : null,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
