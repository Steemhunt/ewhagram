/**
 * 포스트(NFT) 관리 훅
 * 사용자의 NFT 포스트 로딩 및 이미지 에러 처리
 */

import { useState } from "react";
import { mintclub } from "mint.club-v2-sdk";
import { Post } from "@/types";
import { NETWORK } from "@/constants";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  /**
   * 사용자의 NFT 포스트 목록 로딩
   * @param tokenAddress 사용자 토큰 주소
   */
  const loadUserPosts = async (tokenAddress: string) => {
    setLoadingPosts(true);
    setImageErrors(new Set()); // 이전 이미지 에러 초기화

    try {
      // 해당 토큰을 reserve token으로 사용하는 모든 NFT 주소 가져오기
      const nftAddresses = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .bond.getTokensByReserveToken({
          reserveToken: tokenAddress as `0x${string}`,
        });

      console.log("NFT 주소 목록:", nftAddresses);

      // 각 NFT의 상세 정보 가져오기
      const nftDetails = await Promise.all(
        nftAddresses.map(async (address) => {
          try {
            const nft = mintclub.network(NETWORK.BASE_SEPOLIA).nft(address);
            const detail = await nft.getDetail();

            // 이미지 URI 가져오기 (mint.club SDK 방식)
            let imageUrl = "";
            try {
              const imageHash = await nft.getImageUri();
              if (imageHash) {
                imageUrl = mintclub.ipfs.hashToGatewayUrl(imageHash);
              }
            } catch {
              console.log("이미지를 찾을 수 없음:", address);
            }

            return {
              tokenAddress: address,
              name: detail.info.name,
              symbol: detail.info.symbol,
              image: imageUrl || undefined,
            };
          } catch (error) {
            console.error("NFT 상세 정보 로딩 오류:", error);
            return {
              tokenAddress: address,
              name: "Unknown",
              symbol: "Unknown",
              image: undefined,
            };
          }
        }),
      );

      setPosts(nftDetails);
    } catch (error) {
      console.error("포스트 로딩 오류:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  /**
   * 이미지 로딩 실패 처리
   * @param tokenAddress 실패한 NFT의 토큰 주소
   */
  const handleImageError = (tokenAddress: string) => {
    setImageErrors((prev) => new Set([...prev, tokenAddress]));
  };

  /**
   * 포스트 목록 새로고침
   * @param tokenAddress 사용자 토큰 주소
   */
  const refreshPosts = (tokenAddress: string) => {
    if (tokenAddress) {
      loadUserPosts(tokenAddress);
    }
  };

  return {
    posts,
    loadingPosts,
    imageErrors,
    loadUserPosts,
    handleImageError,
    refreshPosts,
  };
};
