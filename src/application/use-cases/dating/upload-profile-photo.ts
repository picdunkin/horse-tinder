import type { AuthenticationService } from "@/src/application/services/authentication.service.interface";
import type { InstrumentationService } from "@/src/application/services/instrumentation.service.interface";
import type { MediaStorageService } from "@/src/application/services/media-storage.service.interface";
import { NotAuthenticatedError } from "@/src/entities/errors/auth";
import { ValidationError } from "@/src/entities/errors/common";

export class UploadProfilePhotoUseCase {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly mediaStorageService: MediaStorageService,
    private readonly instrumentationService: InstrumentationService,
  ) {}

  async execute(file: File) {
    const session = await this.authenticationService.getCurrentSession();
    if (!session) {
      throw new NotAuthenticatedError();
    }

    if (!file.type.startsWith("image/")) {
      throw new ValidationError("Please select an image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new ValidationError("File size must be less than 5MB.");
    }

    const result = await this.mediaStorageService.uploadProfilePhoto(
      session.userId,
      file,
    );

    await this.instrumentationService.track("dating.profile_photo_uploaded", {
      userId: session.userId,
    });

    return result;
  }
}
