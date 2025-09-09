/**
 * 포스트(NFT) 관리 훅
 * 사용자의 NFT 포스트 로딩 및 이미지 에러 처리 (Mint Club REST API 사용)
 */

import { resolveIpfsUrl } from "@/lib/ipfs";
import { Post } from "@/types";
import ky from "ky";
import { useState } from "react";
import { base } from "viem/chains";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  /**
   * 사용자의 NFT 포스트 목록 로딩
   * Mint Club API: /tokens/list를 사용해 reserveToken 기준 조회
   * @param tokenAddress 사용자 토큰 주소
   */
  const loadUserPosts = async (tokenAddress: string) => {
    setLoadingPosts(true);
    setImageErrors(new Set()); // 이전 이미지 에러 초기화

    console.log("[EWHAGRAM] loadUserPosts reserve:", tokenAddress);

    try {
      // Mint Club REST API 클라이언트
      const api = ky.create({ prefixUrl: "https://mint.club/api" });

      type MintClubToken = {
        tokenAddress: string;
        name: string;
        symbol: string;
        metadata?: { logo?: string | null } | null;
      };

      type MintClubListResponse = {
        data?: MintClubToken[];
        tokens?: MintClubToken[];
        count?: number;
        sum?: unknown;
        reserveToken?: {
          tokenAddress: string;
        };
        pagination?: {
          total: number;
          page: number;
          itemsPerPage: number;
          totalPages: number;
        };
      };

      const res = await api
        .get("tokens/list", {
          searchParams: {
            chainId: String(base.id),
            tokenType: "ERC1155",
            itemsPerPage: "50",
            page: "1",
            v1: "false",
            reserveToken: tokenAddress,
          },
        })
        .json<MintClubListResponse>();
      const tokens = (res.tokens ?? res.data ?? []) as MintClubToken[];

      const nftDetails: Post[] = tokens.map((t) => ({
        tokenAddress: t.tokenAddress,
        name: t.name,
        symbol: t.symbol,
        image: resolveIpfsUrl(
          (t.metadata?.logo ?? undefined) as string | undefined
        ),
      }));

      setPosts(nftDetails);
    } catch (error) {
      console.error("포스트 로딩 오류:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  /**
   * 이미지 로딩 실패 처리
   * @param tokenAddress 실패한 NFT의 토큰 주소
   */
  const handleImageError = (tokenAddress: string) => {
    setImageErrors((prev) => new Set([...prev, tokenAddress]));
  };

  /**
   * 포스트 목록 새로고침
   * @param tokenAddress 사용자 토큰 주소
   */
  const refreshPosts = (tokenAddress: string) => {
    if (tokenAddress) {
      loadUserPosts(tokenAddress);
    }
  };

  return {
    posts,
    loadingPosts,
    imageErrors,
    loadUserPosts,
    handleImageError,
    refreshPosts,
  };
};
