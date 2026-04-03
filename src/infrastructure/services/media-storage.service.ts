import type { MediaStorageService } from "@/src/application/services/media-storage.service.interface";
import type { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseMediaStorageService implements MediaStorageService {
  constructor(private readonly supabase: SupabaseClient) {}

  async uploadProfilePhoto(userId: string, file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { error } = await this.supabase.storage
      .from("profile-photos")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from("profile-photos").getPublicUrl(fileName);

    return { url: publicUrl };
  }
}
