"use client";

import { useEffect } from "react";

/**
 * TODO Task 1: MiniKit 준비(ready)
 *
 * KR: 앱 시작 시 MiniKit을 ready 상태로 전환하세요. 준비되면 "/profile"로 이동합니다.
 * EN: Mark MiniKit as ready on app start. After ready, navigate to "/profile".
 *
 * 힌트(Hints):
 * - await sdk.actions.ready();
 */
export default function RootPage() {
  useEffect(() => {
    (async () => {
      // TODO: MiniKit ready 호출
      // await sdk.actions.ready();
      // window.location.href = "/profile";
    })();
  }, []);

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-lg font-semibold">ewhagram</h1>
      <p className="text-sm text-neutral-400 mt-2">
        TODO Task 1: MiniKit ready를 호출해 주세요.
      </p>
    </main>
  );
}
