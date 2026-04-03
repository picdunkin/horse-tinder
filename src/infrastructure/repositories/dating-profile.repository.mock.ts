import type { DatingProfileRepository } from "@/src/application/repositories/dating-profile.repository.interface";
import type {
  DatingProfile,
  UpdateDatingProfileInput,
} from "@/src/entities/models/dating-profile";

export class InMemoryDatingProfileRepository implements DatingProfileRepository {
  constructor(private profiles: DatingProfile[] = []) {}

  async getById(id: string) {
    return this.profiles.find((profile) => profile.id === id) ?? null;
  }

  async getByIds(ids: string[]) {
    const idSet = new Set(ids);
    return this.profiles.filter((profile) => idSet.has(profile.id));
  }

  async listAll() {
    return [...this.profiles];
  }

  async updateById(id: string, input: UpdateDatingProfileInput) {
    const existingProfile = this.profiles.find((profile) => profile.id === id);
    if (!existingProfile) {
      throw new Error("Profile not found.");
    }

    const updatedProfile: DatingProfile = {
      ...existingProfile,
      fullName: input.fullName,
      username: input.username,
      bio: input.bio,
      gender: input.gender,
      birthdate: input.birthdate,
      avatarUrl: input.avatarUrl,
      preferences: input.preferences ?? existingProfile.preferences,
      updatedAt: new Date().toISOString(),
    };

    this.profiles = this.profiles.map((profile) =>
      profile.id === id ? updatedProfile : profile,
    );

    return updatedProfile;
  }
}
