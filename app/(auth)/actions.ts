"use server";

import { createContainer } from "@/di/container";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function buildAbsoluteCallbackUrl() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to resolve callback URL.");
  }

  return `${protocol}://${host}/callback`;
}

export async function getCurrentSessionAction() {
  const container = await createContainer();
  return container.controllers.auth.getCurrentSessionController.execute();
}

export async function signInAction(input: { email: string; password: string }) {
  const container = await createContainer();
  const result = await container.controllers.auth.signInController.execute(input);

  if (result.status === "success") {
    revalidatePath("/", "layout");
  }

  return result;
}

export async function signUpAction(input: { email: string; password: string }) {
  const container = await createContainer();
  const emailRedirectTo = await buildAbsoluteCallbackUrl();

  return container.controllers.auth.signUpController.execute({
    ...input,
    emailRedirectTo,
  });
}

export async function signOutAction() {
  const container = await createContainer();
  const result = await container.controllers.auth.signOutController.execute();

  if (result.status === "success") {
    revalidatePath("/", "layout");
  }

  return result;
}

export async function confirmEmailAction(input: { code: string }) {
  const container = await createContainer();
  const result =
    await container.controllers.auth.confirmEmailController.execute(input);

  if (result.status === "success") {
    revalidatePath("/", "layout");
  }

  return result;
}
