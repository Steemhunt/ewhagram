"use client";

import { fadeIn, spring } from "@/lib/animations";
import { motion } from "motion/react";
import Image from "next/image";
import Orb from "./Orb";

interface SplashProps {
  onStart: () => void;
}

export default function Splash({ onStart }: SplashProps) {
  return (
    <motion.section
      className="fixed inset-0 z-[100] w-screen h-screen flex items-center justify-center bg-black"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Orb background */}
      <div className="absolute inset-0">
        <Orb
          hoverIntensity={0.2}
          rotateOnHover={true}
          hue={115}
          forceHoverState={false}
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/ewha.png"
          alt="EWHA-CHAIN"
          width={112}
          height={112}
          priority
          className="drop-shadow-md"
        />
        <motion.button
          onClick={onStart}
          className="px-6 py-3 rounded-full bg-ewha-600 hover:bg-ewha-700 text-white font-medium shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ ...spring.smooth }}
        >
          시작하기
        </motion.button>
      </div>
    </motion.section>
  );
}
