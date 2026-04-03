"use server";

import { createContainer } from "@/di/container";
import type { UpdateDatingProfileInputPayload } from "@/src/entities/models/dating-profile";
import { revalidatePath } from "next/cache";

export async function getMyDatingProfileAction() {
  const container = await createContainer();
  return container.controllers.dating.getMyDatingProfileController.execute();
}

export async function updateMyDatingProfileAction(
  input: UpdateDatingProfileInputPayload,
) {
  const container = await createContainer();
  const result =
    await container.controllers.dating.updateMyDatingProfileController.execute(
      input,
    );

  if (result.status === "success") {
    revalidatePath("/profile");
    revalidatePath("/profile/edit");
  }

  return result;
}

export async function uploadProfilePhotoAction(file: File) {
  const container = await createContainer();
  return container.controllers.dating.uploadProfilePhotoController.execute(
    file,
  );
}

export async function getDiscoveryFeedAction() {
  const container = await createContainer();
  return container.controllers.dating.getDiscoveryFeedController.execute();
}

export async function likeProfileAction(targetUserId: string) {
  const container = await createContainer();
  const result =
    await container.controllers.dating.swipeOnProfileController.execute({
      targetUserId,
    });

  if (result.status === "success") {
    revalidatePath("/matches");
    revalidatePath("/matches/list");
    revalidatePath("/chat");
  }

  return result;
}

export async function getMyMatchesAction() {
  const container = await createContainer();
  return container.controllers.dating.getMyMatchesController.execute();
}

export async function getMessagingTokenForCurrentUserAction() {
  const container = await createContainer();
  return container.controllers.messaging.getMessagingTokenForCurrentUserController.execute();
}

export async function createOrGetMatchConversationAction(otherUserId: string) {
  const container = await createContainer();
  return container.controllers.messaging.createOrGetMatchConversationController.execute(
    {
      otherUserId,
    },
  );
}

export async function createMatchVideoCallAction(otherUserId: string) {
  const container = await createContainer();
  return container.controllers.messaging.createMatchVideoCallController.execute(
    {
      otherUserId,
    },
  );
}

export async function getVideoCallTokenForCurrentUserAction() {
  const container = await createContainer();
  return container.controllers.messaging.getVideoCallTokenForCurrentUserController.execute();
}
