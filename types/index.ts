/**
 * Yeonstagram (연스타그램) - 타입 정의
 * Yonsei University Instagram Clone with MiniKit & mint.club v2
 */

// 사용자 토큰 정보
export interface UserToken {
  tokenAddress: string;
  symbol: string;
  name: string;
}

// NFT 포스트 정보
export interface Post {
  tokenAddress: string;
  name: string;
  image?: string;
  symbol: string;
}

// Farcaster 사용자 정보
export interface UserContext {
  username?: string;
  pfpUrl?: string;
  displayName?: string;
  fid?: number;
}

// 모달 프롭스
export interface CreatePostModalProps {
  userToken: UserToken | null;
  onClose: () => void;
  onSuccess: () => void;
}

// 컴포넌트 프롭스
export interface PostGridProps {
  posts: Post[];
  imageErrors: Set<string>;
  onImageError: (tokenAddress: string) => void;
}

export interface ProfileHeaderProps {
  userToken: UserToken | null;
  checkingToken: boolean;
  onActivate: () => void;
  user?: UserContext;
}
