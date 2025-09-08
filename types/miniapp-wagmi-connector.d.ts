declare module "@farcaster/miniapp-wagmi-connector" {
  import type { CreateConnectorFn } from "wagmi";
  export function farcasterFrame(): CreateConnectorFn;
}
