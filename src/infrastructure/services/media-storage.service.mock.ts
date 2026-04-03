import type { MediaStorageService } from "@/src/application/services/media-storage.service.interface";

export class MockMediaStorageService implements MediaStorageService {
  async uploadProfilePhoto(userId: string, file: File) {
    return {
      url: `https://example.com/profile-photos/${userId}/${file.name}`,
    };
  }
}
