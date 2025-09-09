/**
 * KR: 앱 전역 프로바이더 - Query, Wagmi(Farcaster 커넥터), Motion 설정
 * EN: App-wide providers - Query, Wagmi(Farcaster connector), Motion config
 */
"use client";

import MotionConfig from "@/components/MotionConfig";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { fallback, http as viemHttp } from "viem";
import { createConfig, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";

// KR: Wagmi 설정 - Base 메인넷 + Farcaster Frame 커넥터 + 퍼블릭 RPC 폴백
// EN: Wagmi config - Base mainnet + Farcaster Frame connector + public RPC fallbacks
const config = createConfig({
  chains: [base],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: fallback(
      [
        viemHttp("https://developer-access-mainnet.base.org"),
        viemHttp("https://mainnet.base.org"),
        viemHttp("https://base.gateway.tenderly.co"),
        viemHttp("https://base.drpc.org"),
        viemHttp("https://base-pokt.nodies.app"),
        viemHttp("https://base.rpc.subquery.network/public"),
        viemHttp("https://endpoints.omniatech.io/v1/base/mainnet/public"),
        viemHttp("https://gateway.tenderly.co/public/base"),
      ],
      { retryCount: 2, rank: false }
    ),
  },
});

export function Providers(props: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <MotionConfig>{props.children}</MotionConfig>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
