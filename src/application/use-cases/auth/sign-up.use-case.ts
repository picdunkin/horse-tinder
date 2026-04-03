import { z } from "zod";
import type {
  AuthenticationService,
  SignUpInput,
} from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import { ValidationError } from "@/src/entities/errors/common";

const SignUpSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  emailRedirectTo: z.string().url(),
});

export class SignUpUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(input: SignUpInput) {
    const parsed = SignUpSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid sign up input.",
      );
    }

    const result = await this.authenticationService.signUp(parsed.data);
    await this.instrumentationService.track("auth.sign_up_requested", {
      email: parsed.data.email,
      requiresEmailConfirmation: result.requiresEmailConfirmation,
    });

    return result;
  }
}
