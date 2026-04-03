import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import {
  UpdateDatingProfileInputSchema,
  type UpdateDatingProfileInputPayload,
} from "@/src/entities/models/dating-profile";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ValidationError } from "@/src/entities/errors/common";

export class UpdateMyDatingProfileUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(input: UpdateDatingProfileInputPayload) {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    const parsed = UpdateDatingProfileInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Profile update is invalid.",
      );
    }

    const updatedProfile = await this.datingProfileRepository.updateById(
      session.userId,
      parsed.data,
    );

    await this.instrumentationService.track("dating.profile_updated", {
      userId: session.userId,
    });

    return updatedProfile;
  }
}
