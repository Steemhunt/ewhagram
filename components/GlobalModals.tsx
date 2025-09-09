"use client";

import CreatePostModal from "@/components/CreatePostModal";
import { useUIStore } from "@/hooks/useUIStore";
import { useUserToken } from "@/hooks/useUserToken";
import { sdk } from "@farcaster/miniapp-sdk";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function GlobalModals() {
  const { isCreatePostOpen, closeCreatePost } = useUIStore();
  const { userToken, checkUserToken } = useUserToken();
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready();
        const ctx = await sdk.context;
        const name = ctx?.user?.username as string | undefined;
        setUsername(name);
        if (name) {
          await checkUserToken(name);
        }
      } catch (_e) {
        // ignore silently; modal will handle missing token via its own checks
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isCreatePostOpen && (
        <CreatePostModal
          userToken={userToken}
          onClose={closeCreatePost}
          onSuccess={closeCreatePost}
        />
      )}
    </AnimatePresence>
  );
}
