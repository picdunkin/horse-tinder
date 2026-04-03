import assert from "node:assert/strict";
import test from "node:test";
import { CreateMatchVideoCallUseCase } from "@/src/application/use-cases/messaging/create-match-video-call";
import { CreateOrGetMatchConversationUseCase } from "@/src/application/use-cases/messaging/create-or-get-match-conversation";
import { SwipeOnProfileUseCase } from "@/src/application/use-cases/dating/swipe-on-profile";
import type { DatingProfile } from "@/src/entities/models/dating-profile";
import { InMemoryDatingProfileRepository } from "@/src/infrastructure/repositories/dating-profile.repository.mock";
import { InMemoryMatchRepository } from "@/src/infrastructure/repositories/match.repository.mock";
import { InMemorySwipeRepository } from "@/src/infrastructure/repositories/swipe.repository.mock";
import { MockAuthenticationService } from "@/src/infrastructure/services/authentication.service.mock";
import { MockInstrumentationService } from "@/src/infrastructure/services/instrumentation.service.mock";
import { MockRealtimeMessagingService } from "@/src/infrastructure/services/realtime-messaging.service.mock";
import { MockTransactionManagerService } from "@/src/infrastructure/services/transaction-manager.service.mock";
import { MockVideoCallService } from "@/src/infrastructure/services/video-call.service.mock";

function makeProfile(
  id: string,
  gender: "male" | "female" | "other" = "female",
): DatingProfile {
  return {
    id,
    fullName: `${id}-name`,
    username: `${id}-user`,
    email: `${id}@example.com`,
    gender,
    birthdate: "1998-01-01",
    bio: "bio",
    avatarUrl: "https://example.com/avatar.png",
    preferences: {
      ageRange: { min: 24, max: 35 },
      distanceKm: 50,
      genderPreference: ["female"],
    },
    locationLat: null,
    locationLng: null,
    lastActiveAt: null,
    isVerified: true,
    isOnline: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  };
}

test("swipe-right creates a mutual match when the other user already liked back", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const profiles = new InMemoryDatingProfileRepository([
    makeProfile("me", "male"),
    makeProfile("them"),
  ]);
  const swipes = new InMemorySwipeRepository([
    {
      fromUserId: "them",
      toUserId: "me",
      direction: "like",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ]);
  const matches = new InMemoryMatchRepository();

  const useCase = new SwipeOnProfileUseCase(
    authenticationService,
    profiles,
    swipes,
    matches,
    new MockTransactionManagerService(),
    new MockInstrumentationService(),
  );

  const result = await useCase.execute("them");
  assert.equal(result.isMatch, true);
  assert.equal(result.matchedProfile?.id, "them");
  assert.equal((await matches.listActiveByUserId("me")).length, 1);
});

test("only matched users can message or start a call", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const profiles = new InMemoryDatingProfileRepository([
    makeProfile("me", "male"),
    makeProfile("them"),
  ]);
  const matches = new InMemoryMatchRepository();

  const conversationUseCase = new CreateOrGetMatchConversationUseCase(
    authenticationService,
    matches,
    profiles,
    new MockRealtimeMessagingService(),
  );
  const videoCallUseCase = new CreateMatchVideoCallUseCase(
    authenticationService,
    matches,
    new MockVideoCallService(),
  );

  await assert.rejects(
    () => conversationUseCase.execute("them"),
    /matched users/,
  );
  await assert.rejects(() => videoCallUseCase.execute("them"), /matched users/);

  await matches.createActiveMatch("me", "them");

  const conversation = await conversationUseCase.execute("them");
  const call = await videoCallUseCase.execute("them");

  assert.equal(conversation.channelType, "messaging");
  assert.equal(call.callType, "default");
});
