import type {
  AuthenticationService,
  ConfirmEmailInput,
  SignInInput,
  SignUpInput,
} from "@/src/application/services/authentication.service.interface";
import type { Session } from "@/src/entities/models/session";

export class MockAuthenticationService implements AuthenticationService {
  constructor(
    private session: Session | null = null,
    private readonly users: Array<{
      email: string;
      password: string;
      session: Session;
    }> = [],
  ) {}

  setSession(session: Session | null) {
    this.session = session;
  }

  async getCurrentSession() {
    return this.session;
  }

  async signIn(input: SignInInput) {
    const user = this.users.find(
      (entry) =>
        entry.email === input.email && entry.password === input.password,
    );

    if (!user) {
      throw new Error("Invalid credentials.");
    }

    this.session = user.session;
    return { session: user.session };
  }

  async signUp(input: SignUpInput) {
    const session: Session = {
      userId: crypto.randomUUID(),
      email: input.email,
    };

    this.users.push({
      email: input.email,
      password: input.password,
      session,
    });

    return {
      session: null,
      requiresEmailConfirmation: true,
    };
  }

  async signOut() {
    this.session = null;
  }

  async confirmEmail(input: ConfirmEmailInput) {
    void input;
    return {
      session: this.session,
    };
  }
}
