import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { RealtimeMessagingService } from "@/src/application/services/realtime-messaging.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ProfileNotFoundError } from "@/src/entities/errors/dating";

export class GetMessagingTokenForCurrentUserUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly realtimeMessagingService: RealtimeMessagingService,
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

    const { token } = await this.realtimeMessagingService.getUserToken({
      id: profile.id,
      name: profile.fullName,
      image: profile.avatarUrl || undefined,
    });

    return {
      token,
      userId: profile.id,
      userName: profile.fullName,
      userImage: profile.avatarUrl || undefined,
    };
  }
}
