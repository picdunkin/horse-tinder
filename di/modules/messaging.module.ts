import { CreateMatchVideoCallUseCase } from "@/src/application/use-cases/messaging/create-match-video-call";
import { CreateOrGetMatchConversationUseCase } from "@/src/application/use-cases/messaging/create-or-get-match-conversation";
import { GetMessagingTokenForCurrentUserUseCase } from "@/src/application/use-cases/messaging/get-messaging-token-for-current-user";
import { GetVideoCallTokenForCurrentUserUseCase } from "@/src/application/use-cases/messaging/get-video-call-token-for-current-user";
import { CreateMatchVideoCallController } from "@/src/interface-adapters/controllers/messaging/create-match-video-call-controller";
import { CreateOrGetMatchConversationController } from "@/src/interface-adapters/controllers/messaging/create-or-get-match-conversation-controller";
import { GetMessagingTokenForCurrentUserController } from "@/src/interface-adapters/controllers/messaging/get-messaging-token-for-current-user-controller";
import { GetVideoCallTokenForCurrentUserController } from "@/src/interface-adapters/controllers/messaging/get-video-call-token-for-current-user-controller";
import type { AppRepositories, AppServices } from "../types";

export function createMessagingModule(
  services: AppServices,
  repositories: AppRepositories,
) {
  const createOrGetMatchConversationUseCase =
    new CreateOrGetMatchConversationUseCase(
      services.authenticationService,
      repositories.matchRepository,
      repositories.datingProfileRepository,
      services.realtimeMessagingService,
    );
  const getMessagingTokenForCurrentUserUseCase =
    new GetMessagingTokenForCurrentUserUseCase(
      services.authenticationService,
      repositories.datingProfileRepository,
      services.realtimeMessagingService,
    );
  const createMatchVideoCallUseCase = new CreateMatchVideoCallUseCase(
    services.authenticationService,
    repositories.matchRepository,
    services.videoCallService,
  );
  const getVideoCallTokenForCurrentUserUseCase =
    new GetVideoCallTokenForCurrentUserUseCase(
      services.authenticationService,
      repositories.datingProfileRepository,
      services.videoCallService,
    );

  return {
    createOrGetMatchConversationController:
      new CreateOrGetMatchConversationController(
        createOrGetMatchConversationUseCase,
      ),
    getMessagingTokenForCurrentUserController:
      new GetMessagingTokenForCurrentUserController(
        getMessagingTokenForCurrentUserUseCase,
      ),
    createMatchVideoCallController: new CreateMatchVideoCallController(
      createMatchVideoCallUseCase,
    ),
    getVideoCallTokenForCurrentUserController:
      new GetVideoCallTokenForCurrentUserController(
        getVideoCallTokenForCurrentUserUseCase,
      ),
  };
}
