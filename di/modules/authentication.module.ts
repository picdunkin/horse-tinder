import { GetCurrentSessionUseCase } from "@/src/application/use-cases/auth/get-current-session.use-case";
import { SignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { SignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { SignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { ConfirmEmailUseCase } from "@/src/application/use-cases/auth/confirm-email.use-case";
import { ConfirmEmailController } from "@/src/interface-adapters/controllers/auth/confirm-email.controller";
import { GetCurrentSessionController } from "@/src/interface-adapters/controllers/auth/get-current-session.controller";
import { SignInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";
import { SignOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";
import { SignUpController } from "@/src/interface-adapters/controllers/auth/sign-up.controller";
import type { AppRepositories, AppServices } from "../types";

export function createAuthenticationModule(
  services: AppServices,
  repositories: AppRepositories,
) {
  const getCurrentSessionUseCase = new GetCurrentSessionUseCase(
    services.authenticationService,
  );
  const signInUseCase = new SignInUseCase(
    services.authenticationService,
    services.instrumentationService,
  );
  const signUpUseCase = new SignUpUseCase(
    services.authenticationService,
    services.instrumentationService,
  );
  const signOutUseCase = new SignOutUseCase(
    services.authenticationService,
    services.instrumentationService,
  );
  const confirmEmailUseCase = new ConfirmEmailUseCase(
    services.authenticationService,
    repositories.datingProfileRepository,
    services.instrumentationService,
  );

  return {
    getCurrentSessionController: new GetCurrentSessionController(
      getCurrentSessionUseCase,
    ),
    signInController: new SignInController(signInUseCase),
    signUpController: new SignUpController(signUpUseCase),
    signOutController: new SignOutController(signOutUseCase),
    confirmEmailController: new ConfirmEmailController(confirmEmailUseCase),
  };
}
