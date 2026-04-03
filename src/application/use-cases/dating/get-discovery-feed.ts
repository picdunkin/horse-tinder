import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { SwipeRepository } from "@/src/application/repositories/swipe.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import {
  matchesAgePreference,
  matchesGenderPreference,
} from "@/src/entities/models/dating-profile";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ProfileNotFoundError } from "@/src/entities/errors/dating";

export class GetDiscoveryFeedUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly swipeRepository: SwipeRepository,
  ) {}

  async execute() {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    const [currentProfile, allProfiles, swipedIds] = await Promise.all([
      this.datingProfileRepository.getById(session.userId),
      this.datingProfileRepository.listAll(),
      this.swipeRepository.listTargetIdsSwipedByUserId(session.userId),
    ]);

    if (!currentProfile) {
      throw new ProfileNotFoundError();
    }

    const hiddenIds = new Set(swipedIds);

    return allProfiles.filter((profile) => {
      if (profile.id === session.userId) {
        return false;
      }

      if (hiddenIds.has(profile.id)) {
        return false;
      }

      if (!matchesGenderPreference(profile.gender, currentProfile.preferences)) {
        return false;
      }

      return matchesAgePreference(profile, currentProfile.preferences);
    });
  }
}
