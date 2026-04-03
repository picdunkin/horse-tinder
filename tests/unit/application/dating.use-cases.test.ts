import assert from "node:assert/strict";
import test from "node:test";
import { GetDiscoveryFeedUseCase } from "@/src/application/use-cases/dating/get-discovery-feed";
import { UpdateMyDatingProfileUseCase } from "@/src/application/use-cases/dating/update-my-dating-profile";
import type { DatingProfile } from "@/src/entities/models/dating-profile";
import { MockAuthenticationService } from "@/src/infrastructure/services/authentication.service.mock";
import { InMemoryDatingProfileRepository } from "@/src/infrastructure/repositories/dating-profile.repository.mock";
import { InMemorySwipeRepository } from "@/src/infrastructure/repositories/swipe.repository.mock";
import { MockInstrumentationService } from "@/src/infrastructure/services/instrumentation.service.mock";

function makeProfile(
  id: string,
  overrides: Partial<DatingProfile> = {},
): DatingProfile {
  return {
    id,
    fullName: `${id}-name`,
    username: `${id}-user`,
    email: `${id}@example.com`,
    gender: overrides.gender ?? "female",
    birthdate: overrides.birthdate ?? "1999-01-01",
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

test("discovery feed excludes self and already-swiped profiles", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const datingProfileRepository = new InMemoryDatingProfileRepository([
    {
      ...makeProfile("me", { gender: "male" }),
      preferences: {
        ageRange: { min: 24, max: 35 },
        distanceKm: 50,
        genderPreference: ["female"],
      },
    },
    makeProfile("candidate-1"),
    makeProfile("candidate-2"),
  ]);
  const swipeRepository = new InMemorySwipeRepository([
    {
      fromUserId: "me",
      toUserId: "candidate-1",
      direction: "like",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ]);

  const useCase = new GetDiscoveryFeedUseCase(
    authenticationService,
    datingProfileRepository,
    swipeRepository,
  );

  const results = await useCase.execute();
  assert.deepEqual(
    results.map((profile) => profile.id),
    ["candidate-2"],
  );
});

test("discovery feed respects dating preferences", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const datingProfileRepository = new InMemoryDatingProfileRepository([
    {
      ...makeProfile("me", { gender: "male" }),
      preferences: {
        ageRange: { min: 24, max: 30 },
        distanceKm: 50,
        genderPreference: ["female"],
      },
    },
    makeProfile("good-match", { gender: "female", birthdate: "1998-01-01" }),
    makeProfile("wrong-gender", { gender: "male", birthdate: "1998-01-01" }),
    makeProfile("wrong-age", { gender: "female", birthdate: "1980-01-01" }),
  ]);

  const useCase = new GetDiscoveryFeedUseCase(
    authenticationService,
    datingProfileRepository,
    new InMemorySwipeRepository(),
  );

  const results = await useCase.execute();
  assert.deepEqual(
    results.map((profile) => profile.id),
    ["good-match"],
  );
});

test("profile update validation rejects invalid bios", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const repository = new InMemoryDatingProfileRepository([
    {
      ...makeProfile("me", { gender: "male" }),
      preferences: {
        ageRange: { min: 24, max: 35 },
        distanceKm: 50,
        genderPreference: ["female"],
      },
    },
  ]);
  const useCase = new UpdateMyDatingProfileUseCase(
    authenticationService,
    repository,
    new MockInstrumentationService(),
  );

  await assert.rejects(
    () =>
      useCase.execute({
        fullName: "Me",
        username: "me",
        bio: "",
        gender: "male",
        birthdate: "1998-01-01",
        avatarUrl: "",
      }),
    /Bio is required/,
  );
});

test("profile update accepts omitted gender preference", async () => {
  const authenticationService = new MockAuthenticationService({
    userId: "me",
    email: "me@example.com",
  });
  const repository = new InMemoryDatingProfileRepository([
    {
      ...makeProfile("me", { gender: "male" }),
      preferences: {
        ageRange: { min: 24, max: 35 },
        distanceKm: 50,
        genderPreference: ["female"],
      },
    },
  ]);
  const useCase = new UpdateMyDatingProfileUseCase(
    authenticationService,
    repository,
    new MockInstrumentationService(),
  );

  const updated = await useCase.execute({
    fullName: "Me",
    username: "me",
    bio: "Updated bio",
    gender: "male",
    birthdate: "1998-01-01",
    avatarUrl: "",
    preferences: {
      ageRange: { min: 24, max: 35 },
      distanceKm: 50,
    },
  });

  assert.deepEqual(updated.preferences.genderPreference, []);
});
