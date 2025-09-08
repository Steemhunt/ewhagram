/**
 * 프로필 헤더 컴포넌트
 * 사용자 정보 표시 및 토큰 활성화 버튼
 */

import { fadeInUp, spring, timing } from "@/lib/animations";
import { ProfileHeaderProps } from "@/types";
import { sdk } from "@farcaster/miniapp-sdk";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ProfileHeader({
  userToken,
  checkingToken,
  onActivate,
}: ProfileHeaderProps) {
  {
    /* 
          TODO Task 2: 프로필 정보 표시
          
          🎯 목표: Farcaster 프로필 정보를 표시하세요
          📝 힌트: const {context} = useMiniKit();
          const userContext = context?.user;
          const userName = userContext?.username;
          const userPfpUrl = userContext?.pfpUrl;
          const userFid = userContext?.fid;
          
        */
  }

  // const data = {
  //   userName: "test",
  //   userPfpUrl: "https://i.makeagif.com/media/12-12-2023/dKpfk7.gif",
  //   userFid: 1111,
  // };

  const [userData, setUserData] = useState<{
    userName?: string;
    userPfpUrl?: string;
    userFid?: number;
  }>({});

  useEffect(() => {
    (async () => {
      const ctx = await sdk.context;
      setUserData({
        userName: ctx?.user?.username,
        userPfpUrl: ctx?.user?.pfpUrl,
        userFid: ctx?.user?.fid,
      });
    })();
  }, []);

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
          {userData.userPfpUrl ? (
            <motion.img
              src={userData.userPfpUrl}
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
              {userData.userName}
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
            className="text-sm text-gray-500 mt-1 text-instagram-caption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: timing.normal }}
          >
            FID: {userData.userFid}
          </motion.p>

          {/* 토큰 정보 표시 */}
          {userToken && (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, ...spring.smooth }}
            >
              <p className="text-sm text-gray-600 text-instagram-body">
                토큰: {userToken.symbol}
              </p>
              <p className="text-xs text-gray-500 text-instagram-caption font-mono">
                {userToken.tokenAddress.slice(0, 8)}...
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
