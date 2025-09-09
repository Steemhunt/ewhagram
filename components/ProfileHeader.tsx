/**
 * KR: 프로필 헤더 - Farcaster 사용자 정보와 토큰 상태를 표시합니다.
 * EN: Profile header - shows Farcaster user info and token status.
 */

import { fadeInUp, spring, timing } from "@/lib/animations";
import { ProfileHeaderProps } from "@/types";
import { motion } from "motion/react";
import { useMemo } from "react";

export default function ProfileHeader({
  userToken,
  checkingToken,
  onActivate,
  user,
}: ProfileHeaderProps) {
  // KR: 페이지에서 전달받은 Farcaster 사용자 컨텍스트를 표시합니다.
  // EN: Render Farcaster user context passed from the page.
  const { userName, userPfpUrl, userFid } = useMemo(() => {
    return {
      userName: user?.username,
      userPfpUrl: user?.pfpUrl,
      userFid: user?.fid,
    };
  }, [user]);

  return (
    <motion.div
      className="px-4 py-6"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, ...spring.smooth }}
      >
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 cursor-pointer ring-2 ring-ewha-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ ...spring.smooth }}
        >
          {/* TODO: 프로필 이미지 조건부 렌더링 */}
          {userPfpUrl ? (
            <motion.img
              src={userPfpUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: timing.normal }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </motion.div>

        {/* 사용자 정보 */}
        <motion.div
          className="ml-6 flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...spring.smooth }}
        >
          <div className="flex items-center space-x-4">
            <motion.h1
              className="text-xl font-semibold text-instagram-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: timing.normal }}
            >
              {userName}
            </motion.h1>

            {/* 토큰 상태에 따른 표시: 토큰 있을 때만 배지 노출 */}
            {userToken ? (
              <motion.div
                className="text-sm px-3 py-1 rounded-full text-white font-medium bg-ewha-600"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, ...spring.bouncy }}
              >
                활성화됨
              </motion.div>
            ) : null}
          </div>

          <motion.p
            className="text-sm text-white/80 mt-1 text-instagram-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: timing.normal }}
          >
            FID: {userFid}
          </motion.p>

          {/* 토큰 정보 표시 */}
          {userToken && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...spring.smooth }}
            >
              <p className="text-sm text-green-500 text-instagram-body">
                내 코인: {userToken.symbol}
              </p>
              <p className="text-[10px] text-white/80 text-instagram-caption font-mono">
                {userToken.tokenAddress.slice(0, 6) +
                  "..." +
                  userToken.tokenAddress.slice(-6)}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
