import type { GetDiscoveryFeedUseCase } from "@/src/application/use-cases/dating/get-discovery-feed";
import { mapControllerError } from "../controller-error";
import { toDiscoveryCardViewModel } from "../view-models";

export class GetDiscoveryFeedController {
  constructor(private readonly useCase: GetDiscoveryFeedUseCase) {}

  async execute() {
    try {
      const profiles = await this.useCase.execute();
      return {
        status: "success" as const,
        profiles: profiles.map(toDiscoveryCardViewModel),
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
