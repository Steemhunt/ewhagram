/**
 * Animation configurations and variants for Yeonstagram
 * Using Motion (Framer Motion) for smooth, Instagram-like animations
 */

import { Variants } from "motion/react";

/**
 * Core animation timing values
 * Based on Instagram's animation standards
 */
export const timing = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

/**
 * Easing functions for smooth animations
 */
export const easing = {
  // Smooth easing for most transitions
  smooth: [0.4, 0, 0.2, 1] as const,
  // Bounce easing for playful interactions
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  // Instagram's standard easing
  instagram: [0.215, 0.61, 0.355, 1] as const,
  // Linear for consistent motion
  linear: [0, 0, 1, 1] as const,
} as const;

/**
 * Spring animation configurations
 */
export const spring = {
  // Smooth spring for general use
  smooth: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  // Bouncy spring for playful interactions
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  },
  // Stiff spring for quick responses
  stiff: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
  },
  // Gentle spring for subtle movements
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  },
} as const;

/**
 * Common animation variants
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    transition: { duration: timing.fast, ease: easing.smooth },
  },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: timing.fast, ease: easing.smooth },
  },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: timing.fast, ease: easing.smooth },
  },
};

export const slideUp: Variants = {
  initial: { y: "100%" },
  animate: {
    y: 0,
    transition: { ...spring.smooth },
  },
  exit: {
    y: "100%",
    transition: { duration: timing.normal, ease: easing.smooth },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
};

/**
 * Hover and tap animations
 */
export const hoverScale = {
  whileHover: { scale: 1.05, transition: spring.smooth },
  whileTap: { scale: 0.95, transition: spring.stiff },
};

export const hoverBrightness = {
  whileHover: {
    filter: "brightness(0.95)",
    transition: { duration: timing.fast },
  },
};

/**
 * Instagram-style post grid animations
 */
export const postGridItem: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ...spring.gentle },
  },
  hover: {
    scale: 1.03,
    transition: { ...spring.smooth },
  },
};

/**
 * Modal animation variants
 */
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: timing.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: timing.fast },
  },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...spring.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: timing.fast, ease: easing.smooth },
  },
};

/**
 * FAB (Floating Action Button) animations
 */
export const fabAnimation: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3,
      ...spring.bouncy,
    },
  },
  hover: {
    scale: 1.1,
    rotate: 90,
    transition: { ...spring.smooth },
  },
  tap: {
    scale: 0.9,
    rotate: 0,
    transition: { ...spring.stiff },
  },
};

/**
 * Loading spinner enhancement
 */
export const spinnerAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear" as const,
      repeat: Infinity,
    },
  },
};

/**
 * Utility function to respect reduced motion preferences
 */
export const respectMotionPreference = (animation: any) => {
  if (typeof window === "undefined") return animation;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return {
      ...animation,
      transition: { duration: 0 },
    };
  }

  return animation;
};

/**
 * Custom hook for scroll-based animations
 */
export const scrollAnimation = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      ...spring.smooth,
      delay: 0.1,
    },
  },
};
