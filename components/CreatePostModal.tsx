/**
 * KR: 포스트 생성 모달 - 이미지 업로드 → 메타데이터 업로드 → NFT 생성 순서로 진행합니다.
 * EN: Create Post Modal - Upload image → upload metadata → create NFT.
 */

import {
  IMAGE_COMPRESSION,
  NETWORK,
  NFT_CONFIG,
  TOAST_MESSAGES,
} from "@/constants";
import { usePosts } from "@/hooks/usePosts";
import { modalContent, modalOverlay, spring, timing } from "@/lib/animations";
import { CreatePostModalProps } from "@/types";
import imageCompression from "browser-image-compression";
import { mintclub } from "mint.club-v2-sdk";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { base } from "viem/chains";
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";

export default function CreatePostModal({
  userToken,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const [postName, setPostName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient();

  // Note: We rely on the SDK to use the active wallet after network switch

  // KR: 트랜잭션 상태 추적(유휴 시 수동 영수증 확인)
  // EN: Track tx state and fallback to manual receipt check
  const txHashRef = useRef<`0x${string}` | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const { data: walletClient } = useWalletClient({
    account: address,
    chainId: base.id,
  });

  const sdk = walletClient
    ? mintclub.withWalletClient({ ...walletClient, chain: base })
    : mintclub;

  const { refreshPosts } = usePosts();

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const scheduleIdleRefresh = () => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(async () => {
      if (!txHashRef.current || !publicClient) return;
      console.log(
        "⏳ 20초 동안 영수증 확인 대기 중. 수동 새로고침 시도:",
        txHashRef.current
      );
      toast.loading("상태 새로고침 중...", { id: "tx-refresh" });
      try {
        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHashRef.current,
          pollingInterval: 2000,
          timeout: 60000,
          confirmations: 1,
        });
        console.log("🔁 수동 새로고침으로 영수증 확인:", receipt);
        toast.success("트랜잭션이 확인되었습니다.", { id: "tx-refresh" });
        clearIdleTimer();
        try {
          if (userToken?.tokenAddress) {
            refreshPosts(userToken.tokenAddress);
          }
        } catch (e) {
          console.error("포스트 새로고침 중 오류:", e);
        }
        toast.success(TOAST_MESSAGES.POST_SUCCESS, { id: "post-creation" });
        onSuccess();
      } catch (e) {
        console.error("수동 영수증 대기 실패:", e);
        toast.error("영수증 확인에 실패했습니다. 잠시 후 다시 시도해주세요.", {
          id: "tx-refresh",
        });
      }
    }, 10000);
  };

  // const { data: walletClient } = useWalletClient({
  //   account: address,
  //   chainId: base.id,
  // });

  /**
   * KR: 체인 확인 및 전환(Base 고정)
   * EN: Ensure on Base network and switch if needed
   */
  const ensureCorrectChain = async (): Promise<boolean> => {
    if (!chain) {
      toast.error("지갑이 연결되지 않았습니다.");
      return false;
    }

    if (chain.id !== base.id) {
      try {
        console.log(
          `🔄 현재 체인 ${chain.id}에서 Base (${base.id})로 전환 중...`
        );
        toast.loading("Base 네트워크로 전환 중...", {
          id: "chain-switch",
        });

        await switchChain({ chainId: base.id });
        toast.success("네트워크가 전환되었습니다.", { id: "chain-switch" });
        return true;
      } catch (error) {
        console.error("❌ 체인 전환 실패:", error);
        toast.error("네트워크 전환에 실패했습니다.", { id: "chain-switch" });
        return false;
      }
    }

    return true;
  };

  /**
   * KR: 파일 선택 처리(미리보기 설정 포함)
   * EN: Handle file input and set preview
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * KR: 이미지를 압축 후 Filebase로 업로드해 IPFS URL을 반환합니다.
   * EN: Compress image and upload via Filebase, returning IPFS URL.
   */
  const uploadToIPFS = async (file: File): Promise<string> => {
    try {
      // 이미지 압축
      console.log("원본 파일 크기:", file.size / 1024 / 1024, "MB");

      const compressedFile = await imageCompression(file, IMAGE_COMPRESSION);
      console.log("압축된 파일 크기:", compressedFile.size / 1024 / 1024, "MB");

      // Filebase를 통한 IPFS 업로드
      const { uploadImage } = await import("../server/ipfs");
      const formData = new FormData();
      formData.append("file", compressedFile);
      const imageHash = await uploadImage(formData);
      return imageHash;
    } catch (error) {
      console.error("IPFS 업로드 오류:", error);
      toast.error(
        "이미지 업로드에 실패했습니다. Filebase API 키와 콘솔을 확인해주세요."
      );
      throw error;
    }
  };

  /**
   * KR: NFT 포스트 생성 전체 플로우
   * EN: Full flow to create an NFT post
   */
  const handleCreate = async () => {
    console.log("🚀 NFT 포스트 생성 시작");
    console.log("🔗 현재 체인 정보:", {
      currentChainId: chain?.id,
      expected: base.id,
    });
    console.log("📝 입력 데이터:", {
      postName,
      hasFile: !!selectedFile,
      userToken,
    });

    // 입력값 검증
    if (!postName || !selectedFile) {
      console.error("❌ 입력값 검증 실패: 이름 또는 파일 누락");
      toast.error(TOAST_MESSAGES.IMAGE_REQUIRED);
      return;
    }

    if (!userToken) {
      console.error("❌ 사용자 토큰이 없습니다");
      toast.error(TOAST_MESSAGES.TOKEN_REQUIRED);
      return;
    }

    if (!userToken.tokenAddress || !userToken.tokenAddress.startsWith("0x")) {
      console.error("❌ 유효하지 않은 토큰 주소:", userToken.tokenAddress);
      toast.error("유효하지 않은 토큰 주소입니다. 토큰을 다시 생성해주세요.");
      return;
    }

    console.log("✅ 모든 입력값 검증 통과");

    // 체인 확인 및 전환
    const chainSwitched = await ensureCorrectChain();
    if (!chainSwitched) {
      return;
    }
    // Small delay to ensure providers & SDK pick up the switched network
    await new Promise((r) => setTimeout(r, 300));

    setCreating(true);
    try {
      // 1. 이미지를 IPFS에 업로드
      setUploading(true);
      console.log("📤 STEP 1: Filebase를 통한 IPFS 이미지 업로드 시작...");
      console.log("📁 파일 정보:", {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)}MB`,
        type: selectedFile.type,
      });
      toast.loading(TOAST_MESSAGES.POST_UPLOAD, { id: "post-creation" });

      const imageUrl = await uploadToIPFS(selectedFile);
      console.log("✅ STEP 1 완료 - 이미지 업로드 성공:", imageUrl);

      if (!imageUrl || !imageUrl.startsWith("ipfs://")) {
        throw new Error(`유효하지 않은 IPFS URL: ${imageUrl}`);
      }

      // 2. 메타데이터를 IPFS에 업로드
      console.log("📋 STEP 2: 메타데이터 IPFS 업로드 시작...");
      const metadata = { image: imageUrl, name: postName };
      console.log("📝 메타데이터:", metadata);
      toast.loading(TOAST_MESSAGES.POST_METADATA, { id: "post-creation" });

      const { uploadMetadata } = await import("../server/ipfs");
      const metadataForm = new FormData();
      metadataForm.append("image", imageUrl);
      metadataForm.append("name", postName);
      const metadataUrl = await uploadMetadata(metadataForm);
      console.log("✅ STEP 2 완료 - 메타데이터 업로드 성공:", metadataUrl);

      if (!metadataUrl || !metadataUrl.startsWith("ipfs://")) {
        throw new Error(`유효하지 않은 메타데이터 URL: ${metadataUrl}`);
      }

      setUploading(false);

      // 3. NFT 생성
      console.log("🎨 STEP 3: NFT 포스트 생성 시작...");
      const nftSymbol = `${postName}-${Date.now()}`
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 20);
      console.log("🏷️ NFT 심볼:", nftSymbol);

      const nftParams = {
        name: postName,
        metadataUrl: metadataUrl as `ipfs://${string}`,
        reserveToken: {
          address: userToken.tokenAddress as `0x${string}`,
          decimals: NFT_CONFIG.DECIMALS,
        },
        curveData: {
          curveType: NFT_CONFIG.CURVE_TYPE,
          stepCount: NFT_CONFIG.STEP_COUNT,
          maxSupply: NFT_CONFIG.MAX_SUPPLY,
          initialMintingPrice: NFT_CONFIG.INITIAL_PRICE,
          finalMintingPrice: NFT_CONFIG.FINAL_PRICE,
          creatorAllocation: NFT_CONFIG.CREATOR_ALLOCATION,
        },
      };

      console.log("⚙️ NFT 생성 파라미터:", nftParams);
      toast.loading(TOAST_MESSAGES.POST_CREATING, { id: "post-creation" });

      console.log("📡 mint.club SDK 호출 중...");
      await sdk
        .network(NETWORK.BASE)
        .nft(nftSymbol)
        .create({
          ...nftParams,
          onSignatureRequest: () => {
            console.log("✍️ 서명 요청됨");
            toast.loading("지갑에서 서명 요청 중...", { id: "post-creation" });
          },
          onSigned: (tx) => {
            console.log("📨 트랜잭션 전송됨:", tx);
            txHashRef.current = tx;
            toast.loading(TOAST_MESSAGES.POST_CREATING, {
              id: "post-creation",
            });
            scheduleIdleRefresh();
          },
          onSuccess: (rcpt) => {
            console.log("✅ onSuccess 영수증:", rcpt);
            toast.success(TOAST_MESSAGES.POST_SUCCESS, { id: "post-creation" });
            clearIdleTimer();
            try {
              if (userToken?.tokenAddress) {
                refreshPosts(userToken.tokenAddress);
              }
            } catch (e) {
              console.error("포스트 새로고침 중 오류:", e);
            }
            onSuccess();
            console.log("🎉 NFT 생성 성공!");
          },
          onError: (error) => {
            console.error("💥 포스트 생성 중 오류 발생:", error);
          },
        });
    } catch (error) {
      console.error("💥 포스트 생성 중 오류 발생:");
      console.error("🔍 에러 타입:", typeof error);
      console.error("📋 에러 상세:", error);

      if (error instanceof Error) {
        console.error("📝 에러 메시지:", error.message);
        console.error("🔗 에러 스택:", error.stack);
      }

      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      console.error("🚨 최종 에러 메시지:", errorMessage);

      if (errorMessage?.includes("FILEBASE_API_KEY")) {
        console.error("❌ Filebase API 키 문제");
        toast.error(TOAST_MESSAGES.FILEBASE_ERROR, { id: "post-creation" });
      } else if (errorMessage?.includes("User rejected")) {
        console.error("❌ 사용자가 트랜잭션 거부");
        toast.error("트랜잭션이 거부되었습니다.", { id: "post-creation" });
      } else if (errorMessage?.includes("insufficient funds")) {
        console.error("❌ 잔액 부족");
        toast.error("ETH 잔액이 부족합니다.", { id: "post-creation" });
      } else if (errorMessage?.includes("already exists")) {
        console.error("❌ NFT 이름 중복");
        toast.error("이미 존재하는 NFT 이름입니다. 다른 이름을 사용해주세요.", {
          id: "post-creation",
        });
      } else if (
        typeof errorMessage === "string" &&
        errorMessage
          .toLowerCase()
          .includes("failed to get transaction receipt") &&
        txHashRef.current &&
        publicClient
      ) {
        // Fallback: try manual receipt wait if SDK receipt fetching failed
        try {
          toast.loading("영수증 재확인 중...", { id: "post-creation" });
          const rcpt = await publicClient.waitForTransactionReceipt({
            hash: txHashRef.current,
            pollingInterval: 2000,
            timeout: 60000,
            confirmations: 1,
          });
          console.log("🧾 수동 영수증 확인 성공:", rcpt);
          toast.success(TOAST_MESSAGES.POST_SUCCESS, { id: "post-creation" });
          clearIdleTimer();
          try {
            if (userToken?.tokenAddress) {
              refreshPosts(userToken.tokenAddress);
            }
          } catch (e2) {
            console.error("포스트 새로고침 중 오류:", e2);
          }
          onSuccess();
          return;
        } catch (e) {
          console.error("수동 영수증 확인 실패:", e);
        }
        toast.error(`포스트 생성에 실패했습니다: ${errorMessage}`, {
          id: "post-creation",
        });
      } else {
        toast.error(`포스트 생성에 실패했습니다: ${errorMessage}`, {
          id: "post-creation",
        });
      }
    } finally {
      console.log("🏁 NFT 생성 프로세스 종료");
      setCreating(false);
      setUploading(false);
      clearIdleTimer();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      variants={modalOverlay}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-neutral-900 rounded-lg max-w-md w-full p-6 text-white"
        variants={modalContent}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <motion.div
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: timing.normal }}
        >
          <h2 className="text-xl font-semibold text-instagram-title">
            새 포스트
          </h2>
          <motion.button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ ...spring.stiff }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </motion.div>

        {/* 이미지 업로드 영역 */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: timing.normal }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2 text-instagram-body">
            이미지
          </label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <motion.button
                onClick={() => {
                  setImagePreview("");
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ ...spring.stiff }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          ) : (
            <motion.label
              className="border-2 border-dashed border-neutral-700 aspect-square w-full flex items-center justify-center rounded-lg p-6 text-center cursor-pointer hover:border-neutral-600 flex-col"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ ...spring.smooth }}
            >
              <motion.svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </motion.svg>
              <p className="text-gray-400 text-instagram-body">
                이미지를 선택하세요
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.label>
          )}
        </motion.div>

        {/* 포스트 이름 입력 */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: timing.normal }}
        >
          <label className="block text-sm font-medium text-white mb-2 text-instagram-body">
            포스트 이름
          </label>
          <motion.input
            type="text"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            placeholder="포스트 이름을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ewha-600 text-black"
            whileFocus={{ scale: 1.02 }}
            transition={{ ...spring.smooth }}
          />
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          className="flex space-x-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: timing.normal }}
        >
          <motion.button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 font-medium text-instagram-body"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ...spring.stiff }}
          >
            취소
          </motion.button>
          <motion.button
            onClick={handleCreate}
            disabled={!postName || !selectedFile || creating || uploading}
            className="flex-1 px-4 py-2 text-white rounded-md disabled:opacity-50 font-medium text-instagram-body bg-ewha-600 hover:bg-ewha-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ ...spring.stiff }}
          >
            {creating || uploading ? "생성 중..." : "포스트 생성"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
