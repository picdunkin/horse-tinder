"use client";

import { getMyMatchesAction } from "@/app/actions";
import ChatHeader from "@/components/ChatHeader";
import StreamChatInterface from "@/components/StreamChatInterface";
import type { MatchListItemViewModel } from "@/src/interface-adapters/controllers/view-models";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatConversationPage() {
  const [otherUser, setOtherUser] = useState<MatchListItemViewModel | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const chatInterfaceRef = useRef<{ handleVideoCall: () => void } | null>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const result = await getMyMatchesAction();
        if (result.status === "error") {
          if (result.error.code === "not_authenticated") {
            router.push("/sign-in");
            return;
          }

          router.push("/chat");
          return;
        }

        const matchedUser = result.matches.find((match) => match.id === userId);
        if (matchedUser) {
          setOtherUser(matchedUser);
        } else {
          router.push("/chat");
        }
      } catch {
        router.push("/chat");
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your matches...
          </p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have permission to chat with them.
          </p>
          <button
            onClick={() => router.push("/chat")}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <ChatHeader
          user={otherUser}
          onVideoCall={() => {
            chatInterfaceRef.current?.handleVideoCall();
          }}
        />

        <div className="flex-1 min-h-0">
          <StreamChatInterface otherUser={otherUser} ref={chatInterfaceRef} />
        </div>
      </div>
    </div>
  );
}
