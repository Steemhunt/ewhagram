/**
 * 사용자 토큰 관리 훅
 * 사용자의 EWHA{USERNAME} 토큰 생성 및 조회 관리
 */

import {
  NETWORK,
  TOAST_MESSAGES,
  USER_TOKEN_CONFIG,
  createTokenSymbol,
} from "@/constants";
import { UserToken } from "@/types";
import { mintclub } from "mint.club-v2-sdk";
import { useState } from "react";
import toast from "react-hot-toast";

export const useUserToken = () => {
  const [userToken, setUserToken] = useState<UserToken | null>(null);
  const [checkingToken, setCheckingToken] = useState(false);

  /**
   * 사용자 토큰 존재 여부 확인
   * mint.club SDK를 사용해서 EWHA{USERNAME} 토큰이 이미 존재하는지 확인
   */
  const checkUserToken = async (username: string) => {
    if (!username) return;

    setCheckingToken(true);
    try {
      // TODO: 토큰 심볼 생성 - `EWHA${username.toUpperCase()}`
      // const tokenSymbol = `EWHATEST`;

      const tokenSymbol = createTokenSymbol(username);
      // TODO: mint.club SDK로 토큰 존재 여부 확인
      // mintclub.network(NETWORK.BASE_SEPOLIA).token(tokenSymbol).exists()
      const exists = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .exists();

      if (exists) {
        console.log("토큰이 존재합니다! 상세 정보를 가져옵니다...");

        const tokenDetail = await mintclub
          .network(NETWORK.BASE_SEPOLIA)
          .token(tokenSymbol)
          .getDetail();

        console.log("토큰 상세 정보:", tokenDetail);

        setUserToken({
          tokenAddress: tokenDetail.info.token,
          symbol: tokenDetail.info.symbol,
          name: tokenDetail.info.name,
        });

        return tokenDetail.info.token;
      } else {
        console.log("토큰이 존재하지 않습니다.");
        setUserToken(null);
        return null;
      }
    } catch (error) {
      console.error("토큰 확인 중 오류:", error);
      setUserToken(null);
      return null;
    } finally {
      setCheckingToken(false);
    }
  };

  /**
   * 새로운 사용자 토큰 생성
   * mint.club SDK로 exponential curve 토큰 생성
   */
  const createUserToken = async (username: string): Promise<boolean> => {
    if (!username) {
      toast.error(TOAST_MESSAGES.USERNAME_REQUIRED);
      return false;
    }

    console.log("토큰 생성 시작");
    toast.loading(TOAST_MESSAGES.TOKEN_CREATION, { id: "token-creation" });

    // TODO: 토큰 심볼 생성 - createTokenSymbol 함수 사용
    const tokenSymbol = createTokenSymbol(username);
    console.log("생성할 토큰 심볼:", tokenSymbol);

    try {
      // TODO: mint.club 토큰 생성
      // mintclub.network(NETWORK.BASE_SEPOLIA).token(tokenSymbol).create({...})
      const result = await mintclub
        .network(NETWORK.BASE_SEPOLIA)
        .token(tokenSymbol)
        .create({
          name: tokenSymbol,
          reserveToken: {
            address: NETWORK.ETH_ADDRESS,
            decimals: USER_TOKEN_CONFIG.DECIMALS,
          },
          curveData: {
            curveType: USER_TOKEN_CONFIG.CURVE_TYPE,
            stepCount: USER_TOKEN_CONFIG.STEP_COUNT,
            maxSupply: USER_TOKEN_CONFIG.MAX_SUPPLY,
            initialMintingPrice: USER_TOKEN_CONFIG.INITIAL_PRICE,
            finalMintingPrice: USER_TOKEN_CONFIG.FINAL_PRICE,
          },
        });
      // const result = false;

      console.log("토큰 생성 결과:", result);

      if (result) {
        console.log("토큰 생성 트랜잭션 전송됨");
        toast.success(TOAST_MESSAGES.TOKEN_SUCCESS, { id: "token-creation" });

        // TODO: 토큰 상태 새로고침 - checkUserToken(username) 호출
        await /* TODO: checkUserToken 함수 호출 */ username;
        return true;
      }

      return false;
    } catch (error) {
      console.error("토큰 생성 중 오류:", error);

      // 에러 메시지 분석
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      if (errorMessage.includes("User rejected")) {
        toast.error("사용자가 트랜잭션을 거부했습니다.", {
          id: "token-creation",
        });
      } else if (errorMessage.includes("insufficient funds")) {
        toast.error("잔액이 부족합니다. Base Sepolia ETH가 필요합니다.", {
          id: "token-creation",
        });
      } else if (errorMessage.includes("already exists")) {
        toast.error("이미 존재하는 토큰 심볼입니다.", { id: "token-creation" });
      } else {
        toast.error(TOAST_MESSAGES.TOKEN_ERROR, { id: "token-creation" });
      }

      return false;
    }
  };

  return {
    userToken,
    checkingToken,
    checkUserToken,
    createUserToken,
  };
};
