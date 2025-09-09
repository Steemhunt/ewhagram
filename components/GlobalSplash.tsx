"use client";

import Splash from "@/components/Splash";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function GlobalSplash() {
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid SSR mismatch
    setMounted(true);
  }, []);

  const handleStart = () => {
    setDismissed(true);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!dismissed ? <Splash key="global-splash" onStart={handleStart} /> : null}
    </AnimatePresence>
  );
}
