"use client";

import MotionConfig from "@/components/MotionConfig";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, mainnet, baseSepolia } from "wagmi/chains";

const config = createConfig({
  chains: [base, baseSepolia, mainnet],
  connectors: [farcasterFrame() as unknown as any],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
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
