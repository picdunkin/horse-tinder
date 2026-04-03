import type { UpdateMyDatingProfileUseCase } from "@/src/application/use-cases/dating/update-my-dating-profile";
import type { UpdateDatingProfileInputPayload } from "@/src/entities/models/dating-profile";
import { mapControllerError } from "../controller-error";
import { toDatingProfileViewModel } from "../view-models";

export class UpdateMyDatingProfileController {
  constructor(private readonly useCase: UpdateMyDatingProfileUseCase) {}

  async execute(input: UpdateDatingProfileInputPayload) {
    try {
      const profile = await this.useCase.execute(input);
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
