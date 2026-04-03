import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";

export class GetCurrentSessionUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async execute() {
    return this.authenticationService.getCurrentSession();
  }
}
