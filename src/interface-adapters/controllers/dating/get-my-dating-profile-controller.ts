import type { GetMyDatingProfileUseCase } from "@/src/application/use-cases/dating/get-my-dating-profile";
import { mapControllerError } from "../controller-error";
import { toDatingProfileViewModel } from "../view-models";

export class GetMyDatingProfileController {
  constructor(private readonly useCase: GetMyDatingProfileUseCase) {}

  async execute() {
    try {
      const profile = await this.useCase.execute();
      return {
        status: "success" as const,
        profile: toDatingProfileViewModel(profile),
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
