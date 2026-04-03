import type { MessagingUserIdentity } from "./realtime-messaging.service.interface";

export interface VideoCallService {
  getUserToken(user: MessagingUserIdentity): Promise<{ token: string }>;
  createOrGetMatchCall(input: {
    currentUserId: string;
    otherUserId: string;
  }): Promise<{ callType: string; callId: string }>;
}
