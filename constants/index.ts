/**
 * ewhagram (이화그램) - 상수 정의
 * 앱에서 사용하는 모든 설정값과 상수들을 한 곳에서 관리합니다.
 * 동작 변경 없이 가독성 향상을 위한 주석 정리만 수행합니다.
 */

// 디자인 상수
export const DESIGN = {
  YONSEI_BLUE: "#2D7157", // Ewha Chain primary (rebranded)
  GRID_COLS: 3, // 인스타그램 스타일 그리드 컬럼 수
} as const;

export const SYMBOL = {
  USER_TOKEN: "OWHA",
} as const;

// 네트워크 설정
export const NETWORK = {
  BASE: "base", // Base 메인넷
} as const;

export const TEST_EWHA_TOKEN_ADDRESS =
  "0x6E7009B73d3A13F6E232Aa329aEaEA6B3C67B1A5";

// 토큰 생성 설정 (사용자 토큰)
export const USER_TOKEN_CONFIG = {
  CURVE_TYPE: "EXPONENTIAL",
  STEP_COUNT: 100,
  MAX_SUPPLY: 1_000_000_000,
  INITIAL_PRICE: 0.000001, // 0.0000001 ETH
  FINAL_PRICE: 0.1, // 0.1 ETH
  DECIMALS: 18,
} as const;

// NFT 생성 설정 (포스트)
export const NFT_CONFIG = {
  CURVE_TYPE: "LINEAR" as const,
  STEP_COUNT: 10,
  MAX_SUPPLY: 100,
  INITIAL_PRICE: 10, // 0.0000001 ETH
  FINAL_PRICE: 1000, // 0.1 ETH
  CREATOR_ALLOCATION: 1,
  DECIMALS: 18,
} as const;

// 이미지 압축 설정
export const IMAGE_COMPRESSION = {
  maxSizeMB: 1, // 최대 파일 크기 1MB
  maxWidthOrHeight: 1920, // 최대 가로/세로 크기
  initialQuality: 0.8, // 초기 품질
  useWebWorker: true,
} as const;

// 토스트 메시지
export const TOAST_MESSAGES = {
  TOKEN_CREATION: "토큰 생성 중...",
  TOKEN_SUCCESS: "토큰이 성공적으로 생성되었습니다! 🎉",
  TOKEN_ERROR: "토큰 생성에 실패했습니다. 다시 시도해주세요.",
  POST_UPLOAD: "🗜️ 이미지 압축 및 업로드 중...",
  POST_METADATA: "📁 메타데이터 업로드 중...",
  POST_CREATING: "🎨 NFT 포스트 생성 중...",
  POST_SUCCESS: "포스트가 성공적으로 생성되었습니다! 🎉",
  USERNAME_REQUIRED: "사용자명이 필요합니다",
  IMAGE_REQUIRED: "이름과 이미지를 추가해주세요",
  TOKEN_REQUIRED: "사용자 토큰을 찾을 수 없습니다",
  FILEBASE_ERROR:
    "Filebase API 키가 설정되지 않았습니다. FILEBASE_SETUP.md를 확인해주세요.",
} as const;

// 유틸리티 함수들
export const createTokenSymbol = (username: string): string =>
  `${SYMBOL.USER_TOKEN}${username.toUpperCase()}`;
