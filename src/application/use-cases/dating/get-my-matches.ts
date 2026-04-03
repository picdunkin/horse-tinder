import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";

export class GetMyMatchesUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matchRepository: MatchRepository,
    private readonly datingProfileRepository: DatingProfileRepository,
  ) {}

  async execute() {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    const matches = await this.matchRepository.listActiveByUserId(session.userId);
    const matchedUserIds = matches.map((match) =>
      match.user1Id === session.userId ? match.user2Id : match.user1Id,
    );

    if (matchedUserIds.length === 0) {
      return [];
    }

    const profiles = await this.datingProfileRepository.getByIds(matchedUserIds);
    const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

    return matchedUserIds
      .map((id) => profileMap.get(id))
      .filter((profile): profile is NonNullable<typeof profile> => Boolean(profile));
  }
}
