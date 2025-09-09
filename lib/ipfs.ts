/**
 * IPFS URL utilities
 * - Normalize ipfs:// and various gateway URLs to a preferred gateway
 * - Provide simple gateway fallback list
 */

export const IPFS_GATEWAYS = [
  "https://ipfs.filebase.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
];

/**
 * Extract the <cid[/path]> portion from an IPFS-like URL
 */
function extractIpfsPath(input: string): string | undefined {
  try {
    const trimmed = input.trim();
    if (!trimmed) return undefined;

    if (trimmed.startsWith("ipfs://")) {
      return trimmed.replace("ipfs://", "");
    }

    // http(s) gateways: .../ipfs/<cid[/path]>
    const ipfsIndex = trimmed.indexOf("/ipfs/");
    if (ipfsIndex !== -1) {
      return trimmed.substring(ipfsIndex + "/ipfs/".length);
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Normalize any IPFS URL (ipfs:// or gateway) to the preferred gateway
 */
export function resolveIpfsUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const path = extractIpfsPath(url);
  if (path) {
    return IPFS_GATEWAYS[0] + path;
  }
  return url;
}

/**
 * Create a list of fallback gateway URLs for a given IPFS url
 */
export function buildIpfsGatewayFallbacks(url?: string | null): string[] {
  if (!url) return [];
  const path = extractIpfsPath(url);
  if (!path) return [url];
  return IPFS_GATEWAYS.map((g) => g + path);
}
