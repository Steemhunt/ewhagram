"use client";

import { getTokenSymbol } from "@/constants";
import { useFeed } from "@/hooks/useFeed";
import farcasterIcon from "@/public/farcaster.png";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { handleScientificNotation } from "mint.club-v2-sdk";
import { motion } from "motion/react";
import Image from "next/image";

/**
 * KR: 피드 페이지 - 크리에이터 코인의 리저브를 사용하는 NFT들을 한 줄로 표시합니다.
 * EN: Feed page - shows NFTs that use creator coins as reserve in a single column.
 */
export default function FeedPage() {
  const { data, isLoading, isError } = useFeed();

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-full aspect-square bg-neutral-900 rounded" />
              <div className="h-4 bg-neutral-900 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center text-red-400">
        피드를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const items = data || [];

  // KR: 생성 시간을 "n분 전" 형태로 표시하는 간단한 포맷터
  // EN: Simple formatter to show time ago like "n minutes ago"
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <main className="max-w-md mx-auto pb-8">
      <div className="space-y-0">
        {items.map((item) => (
          <motion.article
            key={item.tokenAddress}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="border-b border-neutral-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7C65C1] flex items-center justify-center">
                  <Image
                    src={farcasterIcon}
                    alt="farcaster"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{item.creator}</span>
                  <span className="text-xs text-neutral-400">
                    가격:{" "}
                    {item.priceForNextMint
                      ? handleScientificNotation(item.priceForNextMint)
                      : 0}{" "}
                    {getTokenSymbol(item.creator)}
                  </span>
                </div>
              </div>
              <button className="p-1">
                <MoreHorizontal className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Image */}
            {item.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-500 text-sm">No image</span>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button className="p-1">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="p-1">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="p-1">
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button className="p-1">
                  <Bookmark className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-semibold">{item.creator}</span>{" "}
                  {item.name}
                </p>
                {item.createdAt && (
                  <p className="text-xs text-neutral-400">
                    {formatTimeAgo(item.createdAt)}
                  </p>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="h-24" />
    </main>
  );
}
