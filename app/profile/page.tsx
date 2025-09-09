"use client";

import ActivationBanner from "@/components/ActivationBanner";
import CreatePostModal from "@/components/CreatePostModal";
import PostGrid from "@/components/PostGrid";
import ProfileHeader from "@/components/ProfileHeader";
import { usePosts } from "@/hooks/usePosts";
import { useUIStore } from "@/hooks/useUIStore";
import { useUserToken } from "@/hooks/useUserToken";
import { fadeIn, fadeInUp, spinnerAnimation, timing } from "@/lib/animations";
import { sdk } from "@farcaster/miniapp-sdk";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * KR: 프로필 페이지 - Farcaster 컨텍스트를 불러와 사용자 토큰/NFT를 관리합니다.
 * EN: Profile page - loads Farcaster context to manage user token and NFTs.
 */
export default function ProfilePage() {
  const [context, setContext] = useState<any>(null);
  const { userToken, checkingToken, checkUserToken, createUserToken } =
    useUserToken();
  const { posts, loadingPosts, imageErrors, loadUserPosts, handleImageError } =
    usePosts();
  const { isCreatePostOpen, openCreatePost, closeCreatePost } = useUIStore();

  const userContext = context?.user;
  const username = userContext?.username;

  useEffect(() => {
    /**
     * TODO Task 1: MiniKit 초기화 및 사용자 컨텍스트 표시
     *
     * KR: Farcaster MiniKit을 초기화하고 사용자 컨텍스트(아이디/프로필 이미지)를 가져옵니다.
     * EN: Initialize Farcaster MiniKit and fetch user context (username/pfp).
     *
     * 힌트(Hints):
     * - await sdk.actions.ready();
     * - const ctx = await sdk.context;
     */
    (async () => {
      // TODO: ready 후 컨텍스트를 setContext에 저장하세요
      // await sdk.actions.ready();
      // setContext(await sdk.context);
    })();
  }, []);

  useEffect(() => {
    if (username) {
      // KR: 사용자 토큰 존재 확인 후, 있으면 포스트 로딩
      // EN: Check user token; if exists, load posts
      checkUserToken(username).then((tokenAddress) => {
        if (tokenAddress) {
          loadUserPosts(tokenAddress);
        }
      });
    }
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleActivate = async () => {
    if (!username) return;
    const success = await createUserToken(username);
    if (success && userToken) {
      loadUserPosts(userToken.tokenAddress);
    }
  };

  const handlePostSuccess = () => {
    closeCreatePost();
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
      <motion.main
        className="max-w-md mx-auto"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <ProfileHeader
          userToken={userToken}
          checkingToken={checkingToken}
          onActivate={handleActivate}
        />

        <ActivationBanner
          checkingToken={checkingToken}
          hasToken={!!userToken}
          onActivate={handleActivate}
          username={username}
        />

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

      <AnimatePresence>
        {isCreatePostOpen && (
          <CreatePostModal
            userToken={userToken}
            onClose={closeCreatePost}
            onSuccess={handlePostSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
