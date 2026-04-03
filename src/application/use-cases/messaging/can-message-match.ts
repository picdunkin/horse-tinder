import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { MatchRequiredError } from "@/src/entities/errors/dating";

export class CanMessageMatchUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matchRepository: MatchRepository,
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

    return session;
  }
}
