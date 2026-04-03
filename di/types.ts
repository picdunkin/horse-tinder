import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type { MatchRepository } from "@/src/application/repositories/match.repository.interface";
import type { SwipeRepository } from "@/src/application/repositories/swipe.repository.interface";
import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { CrashReporterService } from "@/src/application/services/crash-reporter.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import type { MediaStorageService } from "@/src/application/services/media-storage.service.interface";
import type { RealtimeMessagingService } from "@/src/application/services/realtime-messaging.service.interface";
import type { TransactionManagerService } from "@/src/application/services/transaction-manager.service.interface";
import type { VideoCallService } from "@/src/application/services/video-call.service.interface";
import type { ConfirmEmailController } from "@/src/interface-adapters/controllers/auth/confirm-email.controller";
import type { GetCurrentSessionController } from "@/src/interface-adapters/controllers/auth/get-current-session.controller";
import type { SignInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";
import type { SignOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";
import type { SignUpController } from "@/src/interface-adapters/controllers/auth/sign-up.controller";
import type { GetDiscoveryFeedController } from "@/src/interface-adapters/controllers/dating/get-discovery-feed-controller";
import type { GetMyDatingProfileController } from "@/src/interface-adapters/controllers/dating/get-my-dating-profile-controller";
import type { GetMyMatchesController } from "@/src/interface-adapters/controllers/dating/get-my-matches-controller";
import type { SwipeOnProfileController } from "@/src/interface-adapters/controllers/dating/swipe-on-profile-controller";
import type { UpdateMyDatingProfileController } from "@/src/interface-adapters/controllers/dating/update-my-dating-profile-controller";
import type { UploadProfilePhotoController } from "@/src/interface-adapters/controllers/dating/upload-profile-photo-controller";
import type { CreateMatchVideoCallController } from "@/src/interface-adapters/controllers/messaging/create-match-video-call-controller";
import type { CreateOrGetMatchConversationController } from "@/src/interface-adapters/controllers/messaging/create-or-get-match-conversation-controller";
import type { GetMessagingTokenForCurrentUserController } from "@/src/interface-adapters/controllers/messaging/get-messaging-token-for-current-user-controller";
import type { GetVideoCallTokenForCurrentUserController } from "@/src/interface-adapters/controllers/messaging/get-video-call-token-for-current-user-controller";

export interface AppServices {
  authenticationService: AuthenticationService;
  mediaStorageService: MediaStorageService;
  realtimeMessagingService: RealtimeMessagingService;
  videoCallService: VideoCallService;
  crashReporterService: CrashReporterService;
  instrumentationService: InstrumentationService;
  transactionManagerService: TransactionManagerService;
}

export interface AppRepositories {
  datingProfileRepository: DatingProfileRepository;
  swipeRepository: SwipeRepository;
  matchRepository: MatchRepository;
}

export interface AppControllers {
  auth: {
    getCurrentSessionController: GetCurrentSessionController;
    signInController: SignInController;
    signUpController: SignUpController;
    signOutController: SignOutController;
    confirmEmailController: ConfirmEmailController;
  };
  dating: {
    getMyDatingProfileController: GetMyDatingProfileController;
    updateMyDatingProfileController: UpdateMyDatingProfileController;
    uploadProfilePhotoController: UploadProfilePhotoController;
    getDiscoveryFeedController: GetDiscoveryFeedController;
    swipeOnProfileController: SwipeOnProfileController;
    getMyMatchesController: GetMyMatchesController;
  };
  messaging: {
    createOrGetMatchConversationController: CreateOrGetMatchConversationController;
    getMessagingTokenForCurrentUserController: GetMessagingTokenForCurrentUserController;
    createMatchVideoCallController: CreateMatchVideoCallController;
    getVideoCallTokenForCurrentUserController: GetVideoCallTokenForCurrentUserController;
  };
}

export interface AppContainer {
  services: AppServices;
  repositories: AppRepositories;
  controllers: AppControllers;
}
