/**
 * 포스트 그리드 컴포넌트
 * 인스타그램 스타일의 3열 그리드로 NFT 포스트 표시
 */

import {
  fadeIn,
  postGridItem,
  spinnerAnimation,
  staggerContainer,
} from "@/lib/animations";
import { PostGridProps } from "@/types";
import { AnimatePresence, motion } from "motion/react";

export default function PostGrid({
  posts,
  imageErrors,
  onImageError,
}: PostGridProps) {
  // 로딩 스피너 컴포넌트
  const LoadingSpinner = () => (
    <motion.div
      className="flex items-center justify-center py-20"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="rounded-full h-8 w-8 border-2 border-gray-300 border-t-ewha-600"
        animate={spinnerAnimation.animate}
      />
    </motion.div>
  );

  // 빈 상태 컴포넌트
  const EmptyState = ({ hasToken }: { hasToken: boolean }) => (
    <motion.div
      className="text-center py-20"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="text-gray-500 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </motion.div>
      <motion.p
        className="text-gray-400 text-instagram-body"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        아직 포스트가 없습니다
      </motion.p>
      {hasToken && (
        <motion.p
          className="text-sm text-gray-500 mt-2 text-instagram-caption"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          첫 번째 NFT 포스트를 만들어보세요!
        </motion.p>
      )}
    </motion.div>
  );

  // 포스트 아이템 컴포넌트
  const PostItem = ({ post, index }: { post: any; index: number }) => {
    const hasImageError = imageErrors.has(post.tokenAddress);
    const showImage = post.image && !hasImageError;

    return (
      <motion.div
        className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer"
        variants={postGridItem}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        custom={index}
        transition={{ delay: index * 0.05 }}
      >
        {showImage ? (
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <img
              src={post.image}
              alt={post.name}
              className="w-full h-full object-cover"
              onError={() => onImageError(post.tokenAddress)}
            />
            {/* Instagram-style hover overlay */}
            <motion.div
              className="absolute inset-0 bg-black flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.3 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-white text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium text-instagram-body">
                  {post.name}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          // 이미지 로딩 실패 또는 없을 때 대체 UI
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            <div className="text-center">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-instagram-caption">{post.name}</p>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // 포스트가 있을 때 그리드 표시
  if (posts.length > 0) {
    return (
      <motion.div
        className="grid grid-cols-3 gap-1"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <PostItem
              key={post.tokenAddress || index}
              post={post}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  // 포스트가 없을 때 빈 상태 표시
  return <EmptyState hasToken={true} />;
}
