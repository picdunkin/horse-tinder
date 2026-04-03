import {
  getAgeFromBirthdate,
  type DatingProfile,
} from "@/src/entities/models/dating-profile";

export interface DatingProfileViewModel {
  id: string;
  fullName: string;
  username: string;
  email?: string | null;
  gender: DatingProfile["gender"];
  birthdate: string;
  age: number;
  bio: string;
  avatarUrl: string;
  preferences: DatingProfile["preferences"];
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryCardViewModel {
  id: string;
  fullName: string;
  username: string;
  age: number;
  birthdate: string;
  bio: string;
  avatarUrl: string;
}

export interface MatchListItemViewModel {
  id: string;
  fullName: string;
  username: string;
  age: number;
  birthdate: string;
  bio: string;
  avatarUrl: string;
  createdAt: string;
}

export interface ConversationListItemViewModel extends MatchListItemViewModel {
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export function toDatingProfileViewModel(
  profile: DatingProfile,
): DatingProfileViewModel {
  return {
    id: profile.id,
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email ?? null,
    gender: profile.gender,
    birthdate: profile.birthdate,
    age: getAgeFromBirthdate(profile.birthdate),
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    preferences: profile.preferences,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function toDiscoveryCardViewModel(
  profile: DatingProfile,
): DiscoveryCardViewModel {
  return {
    id: profile.id,
    fullName: profile.fullName,
    username: profile.username,
    age: getAgeFromBirthdate(profile.birthdate),
    birthdate: profile.birthdate,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  };
}

export function toMatchListItemViewModel(
  profile: DatingProfile,
): MatchListItemViewModel {
  return {
    id: profile.id,
    fullName: profile.fullName,
    username: profile.username,
    age: getAgeFromBirthdate(profile.birthdate),
    birthdate: profile.birthdate,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    createdAt: profile.createdAt,
  };
}

export function toConversationListItemViewModel(
  profile: DatingProfile,
): ConversationListItemViewModel {
  return {
    ...toMatchListItemViewModel(profile),
    lastMessage: "Start your conversation!",
    lastMessageTime: profile.createdAt,
    unreadCount: 0,
  };
}
