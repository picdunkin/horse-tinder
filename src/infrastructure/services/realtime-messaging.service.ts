import type {
  MessagingUserIdentity,
  RealtimeMessagingService,
} from "@/src/application/services/realtime-messaging.service.interface";
import { StreamChat } from "stream-chat";
import { createStableMatchIdentifier } from "./stream-identifiers";

export class StreamRealtimeMessagingService
  implements RealtimeMessagingService
{
  private readonly client = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!,
  );

  async getUserToken(user: MessagingUserIdentity) {
    await this.client.upsertUser({
      id: user.id,
      name: user.name,
      image: user.image,
    });

    return {
      token: this.client.createToken(user.id),
    };
  }

  async createOrGetConversation(input: {
    currentUser: MessagingUserIdentity;
    otherUser: MessagingUserIdentity;
  }) {
    await Promise.all([
      this.client.upsertUser({
        id: input.currentUser.id,
        name: input.currentUser.name,
        image: input.currentUser.image,
      }),
      this.client.upsertUser({
        id: input.otherUser.id,
        name: input.otherUser.name,
        image: input.otherUser.image,
      }),
    ]);

    const channelId = createStableMatchIdentifier(
      "match",
      input.currentUser.id,
      input.otherUser.id,
    );

    const channel = this.client.channel("messaging", channelId, {
      members: [input.currentUser.id, input.otherUser.id],
      created_by_id: input.currentUser.id,
    });

    try {
      await channel.create();
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes("already exists")) {
        throw error;
      }
    }

    return {
      channelType: "messaging",
      channelId,
    };
  }
}
