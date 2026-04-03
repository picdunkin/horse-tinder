import type { MessagingUserIdentity } from "@/src/application/services/realtime-messaging.service.interface";
import type { VideoCallService } from "@/src/application/services/video-call.service.interface";

export class MockVideoCallService implements VideoCallService {
  async getUserToken(user: MessagingUserIdentity) {
    return { token: `video-token-for-${user.id}` };
  }

  async createOrGetMatchCall(input: {
    currentUserId: string;
    otherUserId: string;
  }) {
    return {
      callType: "default",
      callId: `${input.currentUserId}-${input.otherUserId}`,
    };
  }
}
