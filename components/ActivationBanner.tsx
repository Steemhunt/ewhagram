"use client";

import { fadeInUp, spring, timing } from "@/lib/animations";
import { motion } from "motion/react";

type ActivationBannerProps = {
  checkingToken: boolean;
  hasToken: boolean;
  onActivate: () => void;
  username?: string;
};

export default function ActivationBanner({
  checkingToken,
  hasToken,
  onActivate,
  username,
}: ActivationBannerProps) {
  const shouldShow = !checkingToken && !hasToken;

  if (!shouldShow) return null;

  return (
    <motion.div
      className="px-4 mb-4"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="relative rounded-xl p-[2px] overflow-hidden">
        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#1f4d3d_0%,#89edc0_50%,#1f4d3d_100%)]" />
        <motion.div
          className="w-full rounded-xl bg-black backdrop-blur-sm p-4 flex items-center gap-4 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: timing.normal }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-instagram-body">
              아직 크리에이터 코인이 없어요. 지금 생성하고 시작해보세요!
            </p>
          </div>

          {/**
           * TODO Task 3: 체크 완료 전까지 버튼 비활성화
           * KR: checkingToken이 true면 버튼이 비활성화되어야 합니다. (현재 로직 확인/수정)
           * EN: Ensure button stays disabled while checkingToken is true.
           */}
          <motion.button
            type="button"
            onClick={() => {
              onActivate();
            }}
            disabled={checkingToken}
            className="px-4 py-2 text-sm font-medium text-white rounded-md bg-ewha-600 hover:bg-ewha-700 disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ ...spring.smooth }}
            aria-label="크리에이터 코인 활성화"
          >
            활성화
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
