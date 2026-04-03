import type {
  MessagingUserIdentity,
  RealtimeMessagingService,
} from "@/src/application/services/realtime-messaging.service.interface";

export class MockRealtimeMessagingService implements RealtimeMessagingService {
  async getUserToken(user: MessagingUserIdentity) {
    return { token: `token-for-${user.id}` };
  }

  async createOrGetConversation(input: {
    currentUser: MessagingUserIdentity;
    otherUser: MessagingUserIdentity;
  }) {
    return {
      channelType: "messaging",
      channelId: `${input.currentUser.id}-${input.otherUser.id}`,
    };
  }
}
