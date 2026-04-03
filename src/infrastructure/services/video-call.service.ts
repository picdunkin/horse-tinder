import type { MessagingUserIdentity } from "@/src/application/services/realtime-messaging.service.interface";
import type { VideoCallService } from "@/src/application/services/video-call.service.interface";
import { StreamChat } from "stream-chat";
import { createStableMatchIdentifier } from "./stream-identifiers";

export class StreamVideoCallService implements VideoCallService {
  private readonly client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!,
  );

  async getUserToken(user: MessagingUserIdentity) {
    return {
      token: this.client.createToken(user.id),
    };
  }

  async createOrGetMatchCall(input: {
    currentUserId: string;
    otherUserId: string;
  }) {
    return {
      callType: "default",
      callId: createStableMatchIdentifier(
        "call",
        input.currentUserId,
        input.otherUserId,
      ),
    };
  }
}
