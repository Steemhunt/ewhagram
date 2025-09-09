"use client";

import { useUIStore } from "@/hooks/useUIStore";
import { sdk } from "@farcaster/miniapp-sdk";
import { Home, PlaySquareIcon, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FooterNav() {
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const { openCreatePost } = useUIStore();

  useEffect(() => {
    (async () => {
      const ctx = await sdk.context;
      setPfpUrl(ctx?.user?.pfpUrl || null);
    })();
  }, []);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-800 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="max-w-md mx-auto px-6 py-3 flex items-center justify-between text-white">
        <Link href="/feed" className="flex items-center justify-center">
          <Home className="w-6 h-6" />
        </Link>

        <Search className="w-6 h-6" />

        <button
          className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center"
          onClick={openCreatePost}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
        <PlaySquareIcon className="w-6 h-6" />

        <Link href="/profile" className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-600">
            {pfpUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pfpUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>
        </Link>
      </div>
      <div className="h-4" />
    </nav>
  );
}
