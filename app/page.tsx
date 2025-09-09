"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

/**
 * TODO Task 1: MiniKit 초기화 및 사용자 컨텍스트 표시
 *
 * KR: Farcaster MiniKit을 초기화하고 사용자 컨텍스트(아이디/프로필 이미지)를 화면에 표시하세요.
 * EN: Initialize Farcaster MiniKit and display user context (username/pfp).
 *
 * 힌트(Hints):
 * - await sdk.actions.ready();
 * - const ctx = await sdk.context;
 * - const user = ctx?.user; user?.username, user?.pfpUrl
 */
export default function RootPage() {
  const [username, setUsername] = useState<string>("");
  const [pfpUrl, setPfpUrl] = useState<string>("");

  useEffect(() => {
    // TODO: MiniKit ready 및 컨텍스트 로드 (위 힌트 참고)
    // e.g., setUsername(user?.username ?? ""); setPfpUrl(user?.pfpUrl ?? "");
  }, []);

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Farcaster MiniKit Demo</h1>
      {pfpUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pfpUrl}
          alt="pfp"
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-neutral-800" />
      )}
      <p className="text-sm text-neutral-300">@{username || "username"}</p>
      <p className="text-xs text-neutral-500">
        TODO: Initialize MiniKit and load user context here.
      </p>
    </main>
  );
}
