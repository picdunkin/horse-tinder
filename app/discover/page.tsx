"use client";

import Image from "next/image";
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TinderCard from "react-tinder-card";
import { Heart, Star, X } from "lucide-react";

import MatchNotification from "@/app/_components/MatchNotification";
import { Button } from "@/app/_components/ui/button";
import { getDiscoveryFeedAction, likeProfileAction } from "@/app/actions";
import type {
  DiscoveryCardViewModel,
  MatchListItemViewModel,
} from "@/src/interface-adapters/controllers/view-models";

type SwipeDirection = "left" | "right" | "up" | "down";
type HorizontalSwipeDirection = Extract<SwipeDirection, "left" | "right">;

type TinderCardHandle = {
  restoreCard: () => Promise<void>;
  swipe: (dir?: SwipeDirection) => Promise<void>;
};

const FALLBACK_AVATAR_URL =
  "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80";

function clampSwipeThreshold(viewportWidth: number) {
  return Math.min(Math.max(viewportWidth * 0.12, 56), 96);
}

export default function DiscoverPage() {
  const [potentialMatches, setPotentialMatches] = useState<
    DiscoveryCardViewModel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [swipeThreshold, setSwipeThreshold] = useState(110);
  const [error, setError] = useState<string | null>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchListItemViewModel | null>(
    null,
  );
  const router = useRouter();

  const currentIndexRef = useRef(currentIndex);
  const likeLabelRef = useRef<HTMLDivElement | null>(null);
  const passLabelRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef<number | null>(null);

  const childRefs = useMemo(
    () =>
      Array.from({ length: potentialMatches.length }, () =>
        createRef<TinderCardHandle | null>(),
      ),
    [potentialMatches.length],
  );

  const updateCurrentIndex = useCallback((nextIndex: number) => {
    currentIndexRef.current = nextIndex;
    setCurrentIndex(nextIndex);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getDiscoveryFeedAction();

      if (result.status === "success") {
        setPotentialMatches(result.profiles);
        updateCurrentIndex(result.profiles.length - 1);
        return;
      }

      if (result.error.code === "not_authenticated") {
        router.push("/sign-in");
        return;
      }

      setPotentialMatches([]);
      updateCurrentIndex(-1);
      setError(result.error.message);
    } catch {
      setPotentialMatches([]);
      updateCurrentIndex(-1);
      setError("Failed to load discovery feed.");
    } finally {
      setLoading(false);
    }
  }, [router, updateCurrentIndex]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    function updateThreshold() {
      setSwipeThreshold(clampSwipeThreshold(window.innerWidth));
    }

    updateThreshold();
    window.addEventListener("resize", updateThreshold);
    return () => window.removeEventListener("resize", updateThreshold);
  }, []);

  const canSwipe = currentIndex >= 0 && currentIndex < potentialMatches.length;

  async function processLike(profileId: string) {
    const result = await likeProfileAction(profileId);

    if (result.status === "error") {
      setError(result.error.message);
      return;
    }

    if (result.isMatch && result.matchedProfile) {
      setMatchedUser(result.matchedProfile);
      setShowMatchNotification(true);
    }
  }

  function swiped(direction: SwipeDirection, index: number) {
    const profile = potentialMatches[index];
    updateCurrentIndex(index - 1);
    clearSwipeLabels();

    if (direction === "right" && profile) {
      void processLike(profile.id);
    }
  }

  async function outOfFrame(index: number) {
    if (currentIndexRef.current >= index) {
      await childRefs[index]?.current?.restoreCard();
    }

    clearSwipeLabels();
  }

  async function swipe(direction: HorizontalSwipeDirection) {
    if (!canSwipe) {
      return;
    }

    setSwipeLabel(direction);
    await childRefs[currentIndex]?.current?.swipe(direction);
  }

  function handleSwipeRequirementFulfilled(direction: SwipeDirection) {
    if (direction === "left" || direction === "right") {
      setSwipeLabel(direction);
      return;
    }

    clearSwipeLabels();
  }

  function setSwipeLabel(direction: HorizontalSwipeDirection) {
    if (direction === "right") {
      likeLabelRef.current?.setAttribute("data-visible", "true");
      passLabelRef.current?.setAttribute("data-visible", "false");
      return;
    }

    passLabelRef.current?.setAttribute("data-visible", "true");
    likeLabelRef.current?.setAttribute("data-visible", "false");
  }

  function clearSwipeLabels() {
    likeLabelRef.current?.setAttribute("data-visible", "false");
    passLabelRef.current?.setAttribute("data-visible", "false");
  }

  const beginDrag = useCallback((clientX: number) => {
    dragStartXRef.current = clientX;
  }, []);

  const updateDrag = useCallback((clientX: number) => {
    const dragStartX = dragStartXRef.current;

    if (dragStartX === null) {
      return;
    }

    const deltaX = clientX - dragStartX;

    if (Math.abs(deltaX) < 4) {
      clearSwipeLabels();
      return;
    }

    setSwipeLabel(deltaX > 0 ? "right" : "left");
  }, []);

  const endDrag = useCallback(() => {
    dragStartXRef.current = null;
    clearSwipeLabels();
  }, []);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      updateDrag(event.clientX);
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      updateDrag(touch.clientX);
    }

    function handlePointerRelease() {
      endDrag();
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseup", handlePointerRelease);
    window.addEventListener("touchend", handlePointerRelease);
    window.addEventListener("touchcancel", handlePointerRelease);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handlePointerRelease);
      window.removeEventListener("touchend", handlePointerRelease);
      window.removeEventListener("touchcancel", handlePointerRelease);
    };
  }, [endDrag, updateDrag]);

  function handleCloseMatchNotification() {
    setShowMatchNotification(false);
    setMatchedUser(null);
  }

  function handleStartChat() {
    if (matchedUser) {
      router.push(`/chat/${matchedUser.id}`);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-background text-foreground">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="animate-pulse text-muted-foreground">
            Finding your matches...
          </p>
        </div>
      </div>
    );
  }

  if (!canSwipe) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-background p-8 text-foreground">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,41,123,0.22),transparent_30%),linear-gradient(180deg,#18191b_0%,#111214_100%)]" />
        <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-border bg-card/40 shadow-2xl backdrop-blur-md">
          <span className="text-4xl drop-shadow-md">💕</span>
        </div>
        <h2 className="relative z-10 mb-3 text-center text-3xl font-bold tracking-tight">
          No more profiles to show
        </h2>
        <p className="relative z-10 mx-auto mb-8 max-w-md text-center text-lg text-muted-foreground">
          {error ?? "Check back later for new matches."}
        </p>
        <Button
          size="lg"
          onClick={() => void loadUsers()}
          className="relative z-10 rounded-full px-8 font-semibold shadow-lg"
        >
          Refresh
        </Button>

        {showMatchNotification && matchedUser ? (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 select-none flex-col overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(253,41,123,0.22),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,102,91,0.12),transparent_32%),linear-gradient(180deg,#18191b_0%,#121315_58%,#0f1012_100%)]" />

      {error ? (
        <div className="relative z-10 flex justify-center px-4 pt-4">
          <p className="rounded-full border border-destructive/20 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
            {error}
          </p>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-8 pt-4">
        <div className="relative flex h-full w-full max-w-sm min-h-0 flex-col items-center justify-center gap-6">
          <div className="relative flex w-full flex-1 items-center justify-center">
            <div
              className="relative h-[min(68dvh,34rem)] w-[min(88vw,22rem)] md:h-[min(76dvh,44rem)] md:w-[min(80vw,31.5rem)]"
              onMouseDownCapture={(event) => beginDrag(event.clientX)}
              onTouchStartCapture={(event) => {
                const touch = event.touches[0];

                if (touch) {
                  beginDrag(touch.clientX);
                }
              }}
            >
              {potentialMatches.map((profile, index) => {
                const isTopCard = index === currentIndex;

                if (index > currentIndex || index < currentIndex - 1) {
                  return null;
                }

                return (
                  <TinderCard
                    key={profile.id}
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    preventSwipe={["up", "down"]}
                    swipeRequirementType="position"
                    swipeThreshold={swipeThreshold}
                    onSwipe={(dir) => swiped(dir, index)}
                    onCardLeftScreen={() => void outOfFrame(index)}
                    onSwipeRequirementFulfilled={
                      isTopCard ? handleSwipeRequirementFulfilled : undefined
                    }
                    onSwipeRequirementUnfulfilled={
                      isTopCard ? clearSwipeLabels : undefined
                    }
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[2.25rem] border border-white/10 bg-card shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                      <div
                        ref={isTopCard ? likeLabelRef : null}
                        data-visible="false"
                        className="pointer-events-none absolute left-5 top-5 z-30 scale-95 rounded-full border border-emerald-300/80 bg-emerald-500/25 px-4 py-2 text-sm font-black tracking-[0.28em] text-white opacity-0 backdrop-blur-md transition-all duration-120 ease-out data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
                      >
                        LIKE
                      </div>
                      <div
                        ref={isTopCard ? passLabelRef : null}
                        data-visible="false"
                        className="pointer-events-none absolute right-5 top-5 z-30 scale-95 rounded-full border border-amber-200/80 bg-amber-500/25 px-4 py-2 text-sm font-black tracking-[0.28em] text-white opacity-0 backdrop-blur-md transition-all duration-120 ease-out data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
                      >
                        PASS
                      </div>
                      <Image
                        src={profile.avatarUrl || FALLBACK_AVATAR_URL}
                        alt={profile.fullName}
                        fill
                        sizes="(max-width: 767px) 88vw, 31.5rem"
                        className="object-cover"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white">
                        <h2 className="text-4xl font-bold tracking-tight drop-shadow-md">
                          {profile.fullName}
                          <span className="ml-2 text-2xl font-light text-white/80">
                            {profile.age}
                          </span>
                        </h2>
                        <p className="mt-3 max-w-full text-sm leading-relaxed text-white/88 drop-shadow-sm">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  </TinderCard>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => void swipe("left")}
              className="pressable group flex h-16 w-16 items-center justify-center rounded-full border border-border/80 bg-card/60 text-muted-foreground shadow-lg backdrop-blur-lg transition-all hover:scale-110 hover:bg-card/80 hover:text-destructive active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <X
                size={28}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            </button>
            <button
              type="button"
              onClick={() => void swipe("right")}
              className="pressable group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-primary/50 bg-primary text-primary-foreground shadow-[0_10px_25px_-5px_rgba(253,41,123,0.3)] transition-all hover:scale-110 hover:shadow-[0_15px_35px_-5px_rgba(253,41,123,0.5)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <div className="absolute inset-0 origin-center scale-0 rounded-full bg-white/20 transition-transform duration-500 group-hover:scale-150" />
              <Heart
                size={36}
                strokeWidth={2.5}
                fill="currentColor"
                className="relative z-10 drop-shadow-md"
              />
            </button>
            <button
              type="button"
              onClick={() => void swipe("right")}
              className="pressable flex h-16 w-16 items-center justify-center rounded-full border border-border/80 bg-card/60 text-muted-foreground shadow-lg backdrop-blur-lg transition-all hover:scale-110 hover:bg-card/80 hover:text-blue-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <Star size={28} strokeWidth={2.5} fill="currentColor" />
            </button>
          </div>
        </div>

        {showMatchNotification && matchedUser ? (
          <MatchNotification
            match={matchedUser}
            onClose={handleCloseMatchNotification}
            onStartChat={handleStartChat}
          />
        ) : null}
      </div>
    </div>
  );
}
