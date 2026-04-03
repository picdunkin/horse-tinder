export interface MediaStorageService {
  uploadProfilePhoto(userId: string, file: File): Promise<{ url: string }>;
}
