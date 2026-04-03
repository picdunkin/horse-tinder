export interface MessagingUserIdentity {
  id: string;
  name: string;
  image?: string;
}

export interface RealtimeMessagingService {
  getUserToken(user: MessagingUserIdentity): Promise<{ token: string }>;
  createOrGetConversation(input: {
    currentUser: MessagingUserIdentity;
    otherUser: MessagingUserIdentity;
  }): Promise<{ channelType: string; channelId: string }>;
}
