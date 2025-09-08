/**
 * Motion Configuration Component
 * Provides global motion settings and respects accessibility preferences
 */

import { MotionConfig as FramerMotionConfig } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MotionConfigProps {
  children: React.ReactNode;
}

export default function MotionConfig({ children }: MotionConfigProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <FramerMotionConfig
      reducedMotion={prefersReducedMotion ? "always" : "never"}
      transition={{
        // Default transition for all animations
        duration: prefersReducedMotion ? 0 : 0.3,
      }}
    >
      {children}
    </FramerMotionConfig>
  );
}
