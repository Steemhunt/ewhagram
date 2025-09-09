"use client";

import { SYMBOL, TEST_EWHA_TOKEN_ADDRESS } from "@/constants";
import { resolveIpfsUrl } from "@/lib/ipfs";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { base } from "viem/chains";

type MintClubToken = {
  chainId: number;
  name: string;
  symbol: string;
  tokenAddress: string;
  tokenType: string; // e.g., "V2_ERC20", "V2_ERC1155"
  isDelisted?: boolean;
  createdAt?: string;
  deployerFcUsername?: string;
  priceForNextMint?: number;
  reserveToken?: {
    chainId: number;
    name: string;
    symbol: string;
    tokenAddress: string;
  };
  metadata?: {
    logo?: string | null;
  } | null;
};

type MintClubListResponse = {
  // Some endpoints return { data, pagination }, others { tokens, count, sum, reserveToken }
  data?: MintClubToken[];
  tokens?: MintClubToken[];
  count?: number;
  sum?: unknown;
  reserveToken?: {
    chainId: number;
    tokenAddress: string;
    name: string;
    symbol: string;
  };
  deployerFcUsername?: string;
  pagination?: {
    total: number;
    page: number;
    itemsPerPage: number;
    totalPages: number;
  };
};

export type FeedItem = {
  tokenAddress: string;
  name: string;
  symbol: string;
  image?: string;
  creator: string;
  createdAt?: string;
  priceForNextMint?: number;
};

// KR: mint.club API 클라이언트. 모든 요청에 공통 prefix를 사용합니다.
// EN: mint.club API client with a shared prefix for requests.
const api = ky.create({ prefixUrl: "https://mint.club/api" });

// KR: 크리에이터 코인(ERC20) 목록 조회 후 접두사 필터링
// EN: Fetch creator coins (ERC20) and filter by symbol prefix
async function fetchCreatorCoins(): Promise<MintClubToken[]> {
  const res = await api
    .get("tokens/list", {
      searchParams: {
        chainId: String(base.id),
        tokenType: "ERC20",
        itemsPerPage: "10",
        page: "1",
        v1: "false",
        reserveToken: TEST_EWHA_TOKEN_ADDRESS,
      },
    })
    .json<MintClubListResponse>();

  // KR: API 응답 로그(디버깅용). 필요 시 주석 처리 가능
  // EN: API response log for debugging; safe to comment out later
  console.log(res);
  const list = (res.tokens ?? res.data ?? []) as MintClubToken[];
  console.log("fetchCreatorCoins", list);

  const prefix = SYMBOL.USER_TOKEN;
  return list.filter((t) => t.symbol?.startsWith(prefix));
}

// KR: 특정 리저브 토큰을 사용하는 ERC1155(NFT) 목록 조회
// EN: Fetch ERC1155 tokens using the provided reserve token
async function fetchNftsByReserveToken(
  reserveTokenAddress: string
): Promise<MintClubToken[]> {
  console.log("fetchNftsByReserveToken", reserveTokenAddress);
  const res = await api
    .get("tokens/list", {
      searchParams: {
        chainId: String(base.id),
        tokenType: "ERC1155",
        itemsPerPage: "5",
        page: "1",
        v1: "false",
        reserveToken: reserveTokenAddress,
      },
    })
    .json<MintClubListResponse>();
  console.log(res);
  return (res.tokens ?? res.data ?? []) as MintClubToken[];
}

// KR: 피드 데이터 구성(크리에이터 코인 → 각 리저브로 NFT 조회 → 병합/정렬)
// EN: Build feed from creator tokens and their NFTs by reserve
async function fetchFeed(): Promise<FeedItem[]> {
  const creators = await fetchCreatorCoins();
  const creatorTokenAddresses = Array.from(
    new Set(creators.map((c) => c.tokenAddress).filter(Boolean))
  );

  // Throttle parallel requests to avoid 429
  const concurrency = 3;
  const chunks: string[][] = [];
  for (let i = 0; i < creatorTokenAddresses.length; i += concurrency) {
    chunks.push(creatorTokenAddresses.slice(i, i + concurrency));
  }

  const results: MintClubToken[] = [];
  for (const chunk of chunks) {
    const part = await Promise.all(
      chunk.map((addr) => fetchNftsByReserveToken(addr))
    );
    results.push(...part.flat());
  }

  console.log("[Feed] nft tokens count:", results.length);
  const items: FeedItem[] = results
    .map((t) => ({
      tokenAddress: t.tokenAddress,
      name: t.name,
      symbol: t.symbol,
      image: resolveIpfsUrl(
        (t.metadata?.logo ?? undefined) as string | undefined
      ),
      creator: t.deployerFcUsername ?? "",
      createdAt: t.createdAt,
      priceForNextMint: t.priceForNextMint,
    }))
    .filter((i) => !!i.image)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  return items;
}

export function useFeed() {
  return useQuery<FeedItem[]>({
    queryKey: ["feed", base.id, SYMBOL.USER_TOKEN],
    queryFn: fetchFeed,
    staleTime: 0, // 데이터를 항상 stale로 간주
    gcTime: 1_000, // 1초 후 가비지 컬렉션
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 20_000, // 5초마다 자동 refetch
    refetchIntervalInBackground: false, // 백그라운드에서도 refetch
  });
}
