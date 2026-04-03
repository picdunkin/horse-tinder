import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ProfileNotFoundError } from "@/src/entities/errors/dating";

export class GetMyDatingProfileUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
  ) {}

  async execute() {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    const profile = await this.datingProfileRepository.getById(session.userId);
    if (!profile) {
      throw new ProfileNotFoundError();
    }

    return profile;
  }
}
