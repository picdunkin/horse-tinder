import type { Session } from "@/src/entities/models/session";

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  emailRedirectTo: string;
}

export interface ConfirmEmailInput {
  code: string;
}

export interface AuthenticationService {
  getCurrentSession(): Promise<Session | null>;
  signIn(input: SignInInput): Promise<{ session: Session }>;
  signUp(
    input: SignUpInput,
  ): Promise<{ session: Session | null; requiresEmailConfirmation: boolean }>;
  signOut(): Promise<void>;
  confirmEmail(input: ConfirmEmailInput): Promise<{ session: Session | null }>;
}
