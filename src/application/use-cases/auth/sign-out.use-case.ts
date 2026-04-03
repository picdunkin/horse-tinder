import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";

export class SignOutUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute() {
    const session = await this.authenticationService.getCurrentSession();
    await this.authenticationService.signOut();
    await this.instrumentationService.track("auth.sign_out", {
      userId: session?.userId ?? null,
    });
  }
}
