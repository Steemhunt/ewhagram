"use client";

/**
 * ewhagram (이화그램) - 메인 앱 컴포넌트
 * Ewha Womans University Instagram-like Mini App with Farcaster Mini App SDK & mint.club v2
 *
 * 주요 기능:
 * - Farcaster Mini App SDK 연동으로 사용자 정보 가져오기
 * - 사용자별 EWHA{USERNAME} 토큰 생성
 * - NFT 포스트 생성 및 표시 (Instagram 스타일)
 * - IPFS 이미지 업로드 (Filebase 사용)
 */

import { sdk } from "@farcaster/miniapp-sdk";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// 커스텀 훅들
import { usePosts } from "@/hooks/usePosts";
import { useUserToken } from "@/hooks/useUserToken";

// 컴포넌트들
import CreatePostModal from "@/components/CreatePostModal";
import PostGrid from "@/components/PostGrid";
import ProfileHeader from "@/components/ProfileHeader";
import Splash from "@/components/Splash";

// 상수 및 타입
import { DESIGN } from "@/constants";

// 애니메이션 설정
import {
  fabAnimation,
  fadeIn,
  fadeInUp,
  spinnerAnimation,
  spring,
  timing,
} from "@/lib/animations";

/**
 * 메인 앱 컴포넌트
 */
export default function App() {
  // Mini App SDK context
  const [context, setContext] = useState<any>(null);

  // 커스텀 훅들
  const { userToken, checkingToken, checkUserToken, createUserToken } =
    useUserToken();
  const { posts, loadingPosts, imageErrors, loadUserPosts, handleImageError } =
    usePosts();

  // 로컬 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Farcaster 사용자 정보
  const userContext = context?.user;
  const username = userContext?.username;

  /**
   * TODO Task 1: MiniKit 초기화
   *
   * 🎯 목표: Farcaster MiniKit SDK 초기화
   * 📝 힌트: setFrameReady(); 함수를 호출하세요
   *
   * 이 함수는 MiniKit이 Farcaster 앱과 통신할 수 있도록 준비시킵니다.
   */
  useEffect(() => {
    (async () => {
      await sdk.actions.ready();
      setContext(await sdk.context);
    })();
  }, []);

  /**
   * 사용자명이 로드되면 토큰 확인 및 포스트 로딩
   */
  useEffect(() => {
    if (username) {
      checkUserToken(username).then((tokenAddress) => {
        if (tokenAddress) {
          loadUserPosts(tokenAddress);
        }
      });
    }
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 토큰 활성화 핸들러
   */
  const handleActivate = async () => {
    if (!username) return;

    const success = await createUserToken(username);
    if (success && userToken) {
      loadUserPosts(userToken.tokenAddress);
    }
  };

  /**
   * 포스트 생성 성공 핸들러
   */
  const handlePostSuccess = () => {
    setShowCreateModal(false);
    if (userToken) {
      loadUserPosts(userToken.tokenAddress);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black overflow-hidden text-white font-instagram"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Splash key="splash" onStart={() => setShowSplash(false)} />
        ) : (
          <motion.div
            key="content"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* 메인 콘텐츠 */}
            <motion.main
              className="max-w-md mx-auto"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              {/* 프로필 섹션 */}
              <ProfileHeader
                userToken={userToken}
                checkingToken={checkingToken}
                onActivate={handleActivate}
              />

              {/* 포스트 그리드 */}
              <motion.div
                className="border-t border-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: timing.normal }}
              >
                {checkingToken || loadingPosts ? (
                  <motion.div
                    className="flex items-center justify-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: timing.normal }}
                  >
                    <motion.div
                      className="rounded-full h-8 w-8 border-2 border-neutral-800 border-t-ewha-600"
                      animate={spinnerAnimation.animate}
                    />
                  </motion.div>
                ) : (
                  <PostGrid
                    posts={posts}
                    imageErrors={imageErrors}
                    onImageError={handleImageError}
                  />
                )}
              </motion.div>
            </motion.main>

            {/* 플로팅 포스트 생성 버튼 */}
            <AnimatePresence>
              {userToken && (
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: DESIGN.YONSEI_BLUE }}
                  variants={fabAnimation}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: showCreateModal ? 45 : 0 }}
                    transition={{ ...spring.stiff }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </motion.svg>
                </motion.button>
              )}
            </AnimatePresence>

            {/* 포스트 생성 모달 */}
            <AnimatePresence>
              {showCreateModal && (
                <CreatePostModal
                  userToken={userToken}
                  onClose={() => setShowCreateModal(false)}
                  onSuccess={handlePostSuccess}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
