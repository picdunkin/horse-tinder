import type { UploadProfilePhotoUseCase } from "@/src/application/use-cases/dating/upload-profile-photo";
import { mapControllerError } from "../controller-error";

export class UploadProfilePhotoController {
  constructor(private readonly useCase: UploadProfilePhotoUseCase) {}

  async execute(file: File) {
    try {
      const result = await this.useCase.execute(file);
      return {
        status: "success" as const,
        url: result.url,
      };
    } catch (error) {
      return {
        status: "error" as const,
        error: mapControllerError(error),
      };
    }
  }
}
