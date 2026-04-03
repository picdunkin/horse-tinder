import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { RealtimeMessagingService } from "@/src/application/services/realtime-messaging.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import {
  MatchRequiredError,
  ProfileNotFoundError,
} from "@/src/entities/errors/dating";

export class CreateOrGetMatchConversationUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matchRepository: MatchRepository,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly realtimeMessagingService: RealtimeMessagingService,
  ) {}

  async execute(otherUserId: string) {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    const match = await this.matchRepository.findActiveBetweenUsers(
      session.userId,
      otherUserId,
    );

    if (!match) {
      throw new MatchRequiredError();
    }

    const [currentUserProfile, otherUserProfile] = await Promise.all([
      this.datingProfileRepository.getById(session.userId),
      this.datingProfileRepository.getById(otherUserId),
    ]);

    if (!currentUserProfile || !otherUserProfile) {
      throw new ProfileNotFoundError();
    }

    return this.realtimeMessagingService.createOrGetConversation({
      currentUser: {
        id: currentUserProfile.id,
        name: currentUserProfile.fullName,
        image: currentUserProfile.avatarUrl || undefined,
      },
      otherUser: {
        id: otherUserProfile.id,
        name: otherUserProfile.fullName,
        image: otherUserProfile.avatarUrl || undefined,
      },
    });
  }
}
