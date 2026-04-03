import assert from "node:assert/strict";
import test from "node:test";
import { GetMyDatingProfileController } from "@/src/interface-adapters/controllers/dating/get-my-dating-profile-controller";
import { GetMyDatingProfileUseCase } from "@/src/application/use-cases/dating/get-my-dating-profile";
import { InMemoryDatingProfileRepository } from "@/src/infrastructure/repositories/dating-profile.repository.mock";
import { MockAuthenticationService } from "@/src/infrastructure/services/authentication.service.mock";

test("dating controller maps domain errors to UI-safe results", async () => {
  const controller = new GetMyDatingProfileController(
    new GetMyDatingProfileUseCase(
      new MockAuthenticationService(null),
      new InMemoryDatingProfileRepository(),
    ),
  );

  const result = await controller.execute();
  assert.equal(result.status, "error");
  if (result.status === "error") {
    assert.equal(result.error.code, "not_authenticated");
  }
});
