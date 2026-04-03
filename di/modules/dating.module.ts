import { GetDiscoveryFeedUseCase } from "@/src/application/use-cases/dating/get-discovery-feed";
import { GetMyDatingProfileUseCase } from "@/src/application/use-cases/dating/get-my-dating-profile";
import { GetMyMatchesUseCase } from "@/src/application/use-cases/dating/get-my-matches";
import { SwipeOnProfileUseCase } from "@/src/application/use-cases/dating/swipe-on-profile";
import { UpdateMyDatingProfileUseCase } from "@/src/application/use-cases/dating/update-my-dating-profile";
import { UploadProfilePhotoUseCase } from "@/src/application/use-cases/dating/upload-profile-photo";
import { GetDiscoveryFeedController } from "@/src/interface-adapters/controllers/dating/get-discovery-feed-controller";
import { GetMyDatingProfileController } from "@/src/interface-adapters/controllers/dating/get-my-dating-profile-controller";
import { GetMyMatchesController } from "@/src/interface-adapters/controllers/dating/get-my-matches-controller";
import { SwipeOnProfileController } from "@/src/interface-adapters/controllers/dating/swipe-on-profile-controller";
import { UpdateMyDatingProfileController } from "@/src/interface-adapters/controllers/dating/update-my-dating-profile-controller";
import { UploadProfilePhotoController } from "@/src/interface-adapters/controllers/dating/upload-profile-photo-controller";
import type { AppRepositories, AppServices } from "../types";

export function createDatingModule(
  services: AppServices,
  repositories: AppRepositories,
) {
  const getMyDatingProfileUseCase = new GetMyDatingProfileUseCase(
    services.authenticationService,
    repositories.datingProfileRepository,
  );
  const updateMyDatingProfileUseCase = new UpdateMyDatingProfileUseCase(
    services.authenticationService,
    repositories.datingProfileRepository,
    services.instrumentationService,
  );
  const uploadProfilePhotoUseCase = new UploadProfilePhotoUseCase(
    services.authenticationService,
    services.mediaStorageService,
    services.instrumentationService,
  );
  const getDiscoveryFeedUseCase = new GetDiscoveryFeedUseCase(
    services.authenticationService,
    repositories.datingProfileRepository,
    repositories.swipeRepository,
  );
  const swipeOnProfileUseCase = new SwipeOnProfileUseCase(
    services.authenticationService,
    repositories.datingProfileRepository,
    repositories.swipeRepository,
    repositories.matchRepository,
    services.transactionManagerService,
    services.instrumentationService,
  );
  const getMyMatchesUseCase = new GetMyMatchesUseCase(
    services.authenticationService,
    repositories.matchRepository,
    repositories.datingProfileRepository,
  );

  return {
    getMyDatingProfileController: new GetMyDatingProfileController(
      getMyDatingProfileUseCase,
    ),
    updateMyDatingProfileController: new UpdateMyDatingProfileController(
      updateMyDatingProfileUseCase,
    ),
    uploadProfilePhotoController: new UploadProfilePhotoController(
      uploadProfilePhotoUseCase,
    ),
    getDiscoveryFeedController: new GetDiscoveryFeedController(
      getDiscoveryFeedUseCase,
    ),
    swipeOnProfileController: new SwipeOnProfileController(
      swipeOnProfileUseCase,
    ),
    getMyMatchesController: new GetMyMatchesController(getMyMatchesUseCase),
  };
}
