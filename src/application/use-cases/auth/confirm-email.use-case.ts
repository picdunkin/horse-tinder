import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type {
  AuthenticationService,
  ConfirmEmailInput,
} from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import { ValidationError } from "@/src/entities/errors/common";

export class ConfirmEmailUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly datingProfileRepository: DatingProfileRepository,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(input: ConfirmEmailInput) {
    if (!input.code) {
      throw new ValidationError("Confirmation code is missing.");
    }

    const result = await this.authenticationService.confirmEmail(input);
    const session = result.session;

    if (!session) {
      return {
        status: "error" as const,
        redirectTo: "/sign-in",
        message: "Your confirmation link is no longer valid.",
      };
    }

    const existingProfile = await this.datingProfileRepository.getById(
      session.userId,
    );
    const redirectTo = existingProfile ? "/discover" : "/profile/edit";

    await this.instrumentationService.track("auth.email_confirmed", {
      userId: session.userId,
      redirectTo,
    });

    return {
      status: "success" as const,
      redirectTo,
      message: "Email confirmed.",
    };
  }
}
