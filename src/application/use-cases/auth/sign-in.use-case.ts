import { z } from "zod";
import type {
  AuthenticationService,
  SignInInput,
} from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import { ValidationError } from "@/src/entities/errors/common";

const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export class SignInUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(input: SignInInput) {
    const parsed = SignInSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(
        parsed.error.issues[0]?.message ?? "Invalid credentials.",
      );
    }

    const result = await this.authenticationService.signIn(parsed.data);
    await this.instrumentationService.track("auth.sign_in", {
      userId: result.session.userId,
    });

    return result;
  }
}
