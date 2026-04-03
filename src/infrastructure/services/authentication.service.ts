import type {
  AuthenticationService,
  ConfirmEmailInput,
  SignInInput,
  SignUpInput,
} from "@/src/application/services/authentication.service.interface";
import { SessionSchema, type Session } from "@/src/entities/models/session";
import type { SupabaseClient } from "@supabase/supabase-js";

function mapUserToSession(user: { id: string; email?: string | null }): Session {
  return SessionSchema.parse({
    userId: user.id,
    email: user.email ?? null,
  });
}

export class SupabaseAuthenticationService implements AuthenticationService {
  constructor(private readonly supabase: SupabaseClient) {}

  async getCurrentSession() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    return user ? mapUserToSession(user) : null;
  }

  async signIn(input: SignInInput) {
    const { data, error } = await this.supabase.auth.signInWithPassword(input);
    if (error || !data.user) {
      throw new Error(error?.message ?? "Failed to sign in.");
    }

    return { session: mapUserToSession(data.user) };
  }

  async signUp(input: SignUpInput) {
    const { data, error } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: input.emailRedirectTo,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      session: data.user && data.session ? mapUserToSession(data.user) : null,
      requiresEmailConfirmation: Boolean(data.user && !data.session),
    };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async confirmEmail(input: ConfirmEmailInput) {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(
      input.code,
    );

    if (error) {
      throw new Error(error.message);
    }

    return {
      session: data.user ? mapUserToSession(data.user) : null,
    };
  }
}
