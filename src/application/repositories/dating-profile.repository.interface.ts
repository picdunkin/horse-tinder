import type {
  DatingProfile,
  UpdateDatingProfileInput,
} from "@/src/entities/models/dating-profile";

export interface DatingProfileRepository {
  getById(id: string): Promise<DatingProfile | null>;
  getByIds(ids: string[]): Promise<DatingProfile[]>;
  listAll(): Promise<DatingProfile[]>;
  updateById(
    id: string,
    input: UpdateDatingProfileInput,
  ): Promise<DatingProfile>;
}
