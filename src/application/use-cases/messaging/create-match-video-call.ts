import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { VideoCallService } from "@/src/application/services/video-call.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { MatchRequiredError } from "@/src/entities/errors/dating";

export class CreateMatchVideoCallUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matchRepository: MatchRepository,
    private readonly videoCallService: VideoCallService,
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

    return this.videoCallService.createOrGetMatchCall({
      currentUserId: session.userId,
      otherUserId,
    });
  }
}
