"use client";

import MotionConfig from "@/components/MotionConfig";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { type ReactNode } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, mainnet } from "wagmi/chains";

const config = createConfig({
  chains: [base, mainnet],
  connectors: [farcasterFrame() as unknown as any],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <MotionConfig>{props.children}</MotionConfig>
    </WagmiProvider>
  );
}
