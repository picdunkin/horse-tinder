"use client";

import {
  createMatchVideoCallAction,
  createOrGetMatchConversationAction,
  getMessagingTokenForCurrentUserAction,
} from "@/app/actions";
import type { MatchListItemViewModel } from "@/src/interface-adapters/controllers/view-models";
import { useRouter } from "next/navigation";
import {
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Channel, type Event, StreamChat } from "stream-chat";
import VideoCall from "./VideoCall";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: Date;
  userId: string;
}

type VideoCallMessageInput = Parameters<Channel["sendMessage"]>[0] & {
  call_id?: string;
  caller_id?: string;
  caller_name?: string;
};

export default function StreamChatInterface({
  otherUser,
  ref,
}: {
  otherUser: MatchListItemViewModel;
  ref: RefObject<{ handleVideoCall: () => void } | null>;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [videoCallId, setVideoCallId] = useState("");
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isCallInitiator, setIsCallInitiator] = useState(false);
  const [incomingCallId, setIncomingCallId] = useState("");
  const [callerName, setCallerName] = useState("");
  const [showIncomingCall, setShowIncomingCall] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  }

  function handleScroll() {
    if (!messagesContainerRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let chatClient: StreamChat | null = null;

    setShowVideoCall(false);
    setVideoCallId("");
    setShowIncomingCall(false);
    setIncomingCallId("");
    setCallerName("");
    setIsCallInitiator(false);
    setMessages([]);
    setLoading(true);

    async function initializeChat() {
      try {
        setError(null);

        const tokenResult = await getMessagingTokenForCurrentUserAction();
        if (tokenResult.status === "error") {
          if (!isMounted) {
            return;
          }

          setError(tokenResult.error.message);
          router.push("/chat");
          return;
        }

        const { token, userId, userName, userImage } = tokenResult.token;
        if (!isMounted) {
          return;
        }

        setCurrentUserId(userId);
        setCurrentUserName(userName);

        chatClient = StreamChat.getInstance(
          process.env.NEXT_PUBLIC_STREAM_API_KEY!,
        );
        await chatClient.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );

        const conversationResult = await createOrGetMatchConversationAction(
          otherUser.id,
        );

        if (conversationResult.status === "error") {
          if (!isMounted) {
            return;
          }

          setError(conversationResult.error.message);
          router.push("/chat");
          return;
        }

        const { channelType, channelId } = conversationResult.conversation;
        const chatChannel = chatClient.channel(channelType, channelId);
        await chatChannel.watch();

        const state = await chatChannel.query({ messages: { limit: 50 } });
        if (!isMounted) {
          return;
        }

        setMessages(
          state.messages.map((message) => ({
            id: message.id,
            text: message.text || "",
            sender: message.user?.id === userId ? "me" : "other",
            timestamp: new Date(message.created_at || new Date()),
            userId: message.user?.id || "",
          })),
        );

        chatChannel.on("message.new", (event: Event) => {
          if (!event.message) {
            return;
          }

          if (event.message.text?.includes("📹 Video call invitation")) {
            const callMessage = event.message as Event["message"] & {
              call_id?: string;
              caller_id?: string;
              caller_name?: string;
            };

            if (callMessage.caller_id !== userId) {
              setIncomingCallId(callMessage.call_id ?? "");
              setCallerName(callMessage.caller_name || "Someone");
              setShowIncomingCall(true);
            }
            return;
          }

          if (event.message.user?.id === userId) {
            return;
          }

          const newMessage: Message = {
            id: event.message.id,
            text: event.message.text || "",
            sender: "other",
            timestamp: new Date(event.message.created_at || new Date()),
            userId: event.message.user?.id || "",
          };

          setMessages((prev) => {
            if (prev.some((message) => message.id === newMessage.id)) {
              return prev;
            }

            return [...prev, newMessage];
          });
        });

        chatChannel.on("typing.start", (event: Event) => {
          if (event.user?.id !== userId) {
            setIsTyping(true);
          }
        });

        chatChannel.on("typing.stop", (event: Event) => {
          if (event.user?.id !== userId) {
            setIsTyping(false);
          }
        });

        setClient(chatClient);
        setChannel(chatChannel);
      } catch {
        if (isMounted) {
          router.push("/chat");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeChat();

    return () => {
      isMounted = false;
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [otherUser.id, router]);

  async function handleVideoCall() {
    const result = await createMatchVideoCallAction(otherUser.id);
    if (result.status === "error") {
      setError(result.error.message);
      return;
    }

    setVideoCallId(result.call.callId);
    setShowVideoCall(true);
    setIsCallInitiator(true);

    if (channel) {
      const message: VideoCallMessageInput = {
        text: "📹 Video call invitation",
        call_id: result.call.callId,
        caller_id: currentUserId,
        caller_name: currentUserName || "Someone",
      };

      await channel.sendMessage(message);
    }
  }

  useImperativeHandle(ref, () => ({
    handleVideoCall,
  }));

  async function handleSendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim() || !channel) {
      return;
    }

    const response = await channel.sendMessage({
      text: newMessage.trim(),
    });

    const sentMessage: Message = {
      id: response.message.id,
      text: newMessage.trim(),
      sender: "me",
      timestamp: new Date(),
      userId: currentUserId,
    };

    setMessages((prev) => {
      if (prev.some((message) => message.id === sentMessage.id)) {
        return prev;
      }

      return [...prev, sentMessage];
    });

    setNewMessage("");
  }

  function handleCallEnd() {
    setShowVideoCall(false);
    setVideoCallId("");
    setIsCallInitiator(false);
    setShowIncomingCall(false);
    setIncomingCallId("");
    setCallerName("");
  }

  function handleDeclineCall() {
    setShowIncomingCall(false);
    setIncomingCallId("");
    setCallerName("");
  }

  function handleAcceptCall() {
    setVideoCallId(incomingCallId);
    setShowVideoCall(true);
    setShowIncomingCall(false);
    setIncomingCallId("");
    setIsCallInitiator(false);
  }

  function formatTime(date: Date) {
    return date.toLocaleDateString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (loading || !client || !channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Setting up chat...
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth chat-scrollbar relative"
        style={{ scrollBehavior: "smooth" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "me"
                  ? "bg-gradient-to-r from-pink-500 to-red-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "me"
                    ? "text-pink-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping ? (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton ? (
        <div className="absolute bottom-20 right-6 z-10">
          <button
            onClick={scrollToBottom}
            className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Scroll to bottom"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      ) : null}

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form className="flex space-x-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(event) => {
              setNewMessage(event.target.value);

              if (channel && event.target.value.length > 0) {
                channel.keystroke();
              }
            }}
            onFocus={() => {
              if (channel) {
                channel.keystroke();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            disabled={!channel}
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || !channel}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </form>
      </div>

      {showIncomingCall ? (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-pink-500">
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Incoming Video Call
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {callerName || otherUser.fullName} is calling you
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeclineCall}
                  className="flex-1 bg-red-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-red-600 transition-colors duration-200"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptCall}
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showVideoCall && videoCallId ? (
        <VideoCall
          onCallEnd={handleCallEnd}
          callId={videoCallId}
          isIncoming={!isCallInitiator}
        />
      ) : null}
    </div>
  );
}
