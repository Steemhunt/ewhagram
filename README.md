# 이화그램 (ewhagram)

Ewha-themed Instagram-like Mini App with Farcaster Mini App SDK & mint.club v2

![Ewhagram Preview](https://media.discordapp.net/attachments/995243442261217361/1414641023589552198/Screenshot_2025-09-09_at_00.58.18.png?ex=68c04e9e&is=68befd1e&hm=b0d85d622390e47c706dde341947b8e17fc6bbac7f76e2e26af16450c271073e&=&format=webp&quality=lossless&width=682&height=742)

![Ewhagram Preview 2](https://media.discordapp.net/attachments/995243442261217361/1414644917187121264/Screenshot_2025-09-09_at_01.13.43.png?ex=68c0523f&is=68bf00bf&hm=b069d3f7bdec8fa1f7dcee15e4ba645164b53406a08576d14cc3d5cd389c1cca&=&format=webp&quality=lossless&width=706&height=815)

## 🌟 프로젝트 소개

ewhagram은 이화여자대학교 감성을 담은 Instagram 스타일 미니 앱으로, Farcaster Mini App SDK와 mint.club v2 SDK를 활용하여 다음과 같은 기능을 제공합니다:

- **🎯 개인 토큰 발행**: 각 사용자마다 `EWHA{USERNAME}` 토큰 생성
- **📸 NFT 포스트**: 이미지를 NFT로 민팅하여 Instagram 스타일 피드에 표시
- **🔗 Farcaster 연동**: Farcaster Mini App SDK + wagmi 커넥터를 통한 사용자 컨텍스트/지갑 연동
- **☁️ IPFS 저장**: Filebase를 통한 탈중앙화 이미지 저장

## 🚀 시작하기

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn
- Filebase 계정 (IPFS 업로드용)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/steemhunt/ewhagram.git
   cd ewhagram
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` 파일에 다음 값을 설정하세요:
   ```
   NEXT_PUBLIC_FILEBASE_API_KEY=your_filebase_api_key
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **ngrok 터널 설정 (선택사항 - Farcaster 테스트용)**

   Farcaster MiniApp은 외부에서 접근 가능한 URL이 필요합니다. 로컬 개발 환경에서 테스트하려면 터널을 설정하세요.

   ```bash
   # ngrok 설치 (macOS)
   brew install ngrok
   
   # 또는 npm으로 설치
   npm install -g ngrok
   
   # 터널 실행 (별도 터미널에서)
   ngrok http 3000
   ```
   
   실행 후 표시되는 `https://****-***-***-***.ngrok-free.app` URL을 사용하여 외부에서 앱에 접근할 수 있습니다.

6. **브라우저에서 확인**
   ```
   # 로컬 개발
   http://localhost:3000
   
   # 외부 접근 (ngrok 터널 사용시)
   https://****-***-***-***.ngrok-free.app
   ```

## 🏗️ 프로젝트 구조

```
./
├── app/
│   ├── page.tsx             # 메인 앱 컴포넌트
│   └── layout.tsx           # 레이아웃 설정
├── components/
│   ├── ActivationBanner.tsx # 토큰 미보유 시 활성화 배너 (프로필 아래)
│   ├── ProfileHeader.tsx    # 프로필 헤더 (보유 시 "활성화됨" 배지)
│   ├── PostGrid.tsx         # 포스트 그리드 컴포넌트
│   └── CreatePostModal.tsx  # 포스트 생성 모달
├── hooks/
│   ├── useUserToken.ts      # 사용자 토큰 관리 훅
│   └── usePosts.ts          # 포스트 관리 훅
├── lib/
│   └── animations.ts        # 모션/애니메이션 유틸
├── types/
│   └── index.ts             # TypeScript 타입 정의
├── constants/
│   └── index.ts             # 앱 상수 및 설정값
└── server/
    └── ipfs.ts              # IPFS 업로드 서버 액션
```

## 🔧 주요 기능

### 1. 사용자 토큰 시스템

각 사용자는 Farcaster 사용자명을 기반으로 한 개인 토큰을 발행할 수 있습니다.

- **토큰명**: `EWHA{USERNAME}` (예: EWHALUCY)
- **네트워크**: Base 메인넷
- **토큰경제**: 지수함수 커브, 초기가격 0.0000001 ETH, 최종가격 0.1 ETH

### 2. NFT 포스트 생성

사용자는 이미지를 업로드하여 NFT 포스트를 생성할 수 있습니다.

- **Reserve Token**: 사용자의 개인 토큰
- **이미지 저장**: IPFS (Filebase)
- **메타데이터**: JSON 형태로 IPFS에 저장

### 3. Instagram 스타일 UI

이화체인 브랜드 컬러(#2D7157)를 활용한 깔끔한 UI/UX, 섬세한 모션(Framer Motion)

- **3열 그리드**: 인스타그램과 동일한 포스트 레이아웃
- **프로필 섹션**: Farcaster 프로필 정보 표시
- **반응형 디자인**: 모바일 우선 설계

### 4. 라우팅 및 페이지 구조

- 기본 홈(`/`)은 이제 피드 페이지(`/feed`)로 리다이렉트됩니다.
- 프로필/내 포스트 관리는 `/profile`에서 사용합니다.
- 스플래시는 앱 최초 진입 시 한 번만 노출되며, "시작하기" 클릭 후 다시 보이지 않습니다.

### 5. Feed 페이지 (Base 메인넷)

`/feed` 경로에서 크리에이터 코인(ERC20)을 리저브로 사용하는 NFT(ERC1155)들을 한 줄(단일 컬럼)로 표시합니다. 각 아이템은 전체 너비 이미지를 보여주고, 생성자/심볼/생성시각 등을 함께 렌더링합니다.

데이터는 TanStack Query + ky를 통해 `https://mint.club/api/tokens/list`에서 가져옵니다.

1) 크리에이터 코인(ERC20) 목록 조회
- 파라미터: `chainId=8453`, `tokenType=ERC20`, `page=1`, `itemsPerPage=10`, `v1=false`, `reserveToken=NETWORK.ETH_ADDRESS`
- `SYMBOL.USER_TOKEN` 접두사로 시작하는 심볼만 필터링

2) 각 크리에이터 코인의 `tokenAddress`를 reserveToken으로 사용하여 NFT(ERC1155) 조회
- 파라미터: `chainId=8453`, `tokenType=ERC1155`, `page=1`, `itemsPerPage=3`, `v1=false`, `reserveToken=<creatorCoinTokenAddress>`

## 🔑 환경변수 설정

### Filebase 설정

1. [Filebase](https://filebase.com/)에 가입
2. IPFS 버킷 생성
3. Access Keys에서 API 키 생성
4. `.env.local`에 API 키 추가

자세한 설정 방법은 [FILEBASE_SETUP.md](FILEBASE_SETUP.md)를 참조하세요.

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: mint.club v2 SDK, Base
- **Storage**: IPFS (Filebase)
- **Authentication**: Farcaster Mini App SDK + wagmi connector
- **State Management**: React Hooks (Custom)

## 📝 코드 구조 설명

### 커스텀 훅

#### `useUserToken.ts`
```typescript
// 사용자 토큰 생성 및 관리
const { userToken, checkingToken, checkUserToken, createUserToken } = useUserToken();
```

#### `usePosts.ts`
```typescript
// NFT 포스트 로딩 및 이미지 에러 처리
const { posts, loadingPosts, imageErrors, loadUserPosts, handleImageError } = usePosts();
```

### 주요 컴포넌트

#### `ProfileHeader.tsx`
- Farcaster 프로필 정보 표시
- 토큰 상태 표시 (보유 시 "활성화됨" 배지)

#### `ActivationBanner.tsx`
- 프로필 섹션 바로 아래에 표시되는 배너
- 사용자가 크리에이터 코인을 아직 보유하지 않은 경우에만 노출
- 좌측 설명 텍스트 + 우측 "활성화" 버튼 (EWHA 그린 강조, 애니메이션 보더)

#### `PostGrid.tsx`
- 3열 그리드 레이아웃
- 이미지 로딩 실패 처리
- 빈 상태 표시

#### `CreatePostModal.tsx`
- 이미지 업로드 및 압축
- IPFS 메타데이터 업로드
- NFT 민팅

## 🎯 데모 시나리오

1. **사용자 온보딩**: Farcaster로 로그인 후 토큰 활성화
2. **첫 포스트 생성**: 이미지 업로드 및 NFT 민팅
3. **피드 확인**: Instagram 스타일 그리드에서 포스트 확인
4. **추가 포스트**: 더 많은 NFT 포스트 생성

## 🎓 Hands-on 라이브 코딩 워크샵

**총 소요시간**: 약 20분  
**난이도**: 초급~중급  
**목표**: Farcaster MiniKit과 mint.club SDK 핵심 기능 체험

### 📋 워크샵 준비사항

1. **Node.js 18+** 설치
2. **Farcaster 계정** (Warpcast 앱에서 생성)
3. **Filebase 계정** 및 API 키
4. **Base 메인넷 ETH** (필요 시)

### 🚀 Task 0: 환경 설정 (5분)

#### 1. 프로젝트 클론 및 설치
```bash
git clone https://github.com/steemhunt/ewhagram.git
cd ewhagram
npm install
```





#### 2. Filebase API 키 설정
1. [Filebase](https://filebase.com/) 가입
2. IPFS 버킷 생성
3. Access Keys → Create Key
4. `.env.local` 파일 생성:
```bash
NEXT_PUBLIC_FILEBASE_API_KEY=당신의_API_키
```

#### 3. 네트워크 준비
메인넷 트랜잭션은 실제 비용이 발생할 수 있습니다. 충분한 ETH가 있는지 확인하세요.

#### 4. 프로젝트 실행
```bash
npm run dev
```

#### 5. 로컬 터널 설정 (선택사항)
Farcaster 미리보기/실기기 테스트용으로 외부 접근 URL이 필요하면 상단의 ngrok 설치 가이드를 사용하세요. 터널 실행 후 표시되는 HTTPS URL을 사용하면 됩니다.

---

### ⚡ Task 1: MiniKit 초기화 (3분)

**🎯 목표**: Farcaster MiniKit 연결하기

**📍 파일**: `app/page.tsx`

```typescript
/**
 * MiniKit 초기화
 */
useEffect(() => {
  // TODO: MiniKit SDK 초기화 코드 작성
  // 힌트: sdk.actions.ready();
}, []);
```

**💡 해결 방법**: `sdk.actions.ready();` 추가

**✅ 성공 확인**: 브라우저에서 "연결됨" 상태 표시

---

### 👤 Task 2: 사용자 정보 표시 (4분)

**🎯 목표**: Farcaster 프로필 정보 가져와서 화면에 표시하기

**📍 파일**: `components/ProfileHeader.tsx`

**핵심 TODO 3개:**

1. **프로필 이미지**: `userContext?.pfpUrl` 조건부 렌더링
2. **사용자명**: `userContext?.username || "사용자"`  
3. **FID**: `userContext?.fid` (선택사항)

```typescript
// TODO 1: 프로필 이미지
{userContext?.pfpUrl ? (
  <img src={userContext.pfpUrl} alt="Profile" className="w-full h-full object-cover" />
) : (
  // 기본 아바타
)}

// TODO 2: 사용자명
<h1 className="text-xl font-bold">
  {userContext?.username || "사용자"}
</h1>

// TODO 3: FID (선택사항)
{userContext?.fid && (
  <p className="text-sm text-gray-500 mt-1">FID: {userContext.fid}</p>
)}
```

**✅ 성공 확인**: 본인의 Farcaster 프로필 사진과 사용자명이 표시됨

---

### 🪙 Task 3: 토큰 존재 확인 (5분)

**🎯 목표**: mint.club SDK로 사용자 토큰 존재 여부 확인하기

**📍 파일**: `hooks/useUserToken.ts`

**핵심 TODO 2개:**

1. **토큰 심볼 생성**: `EWHA${username.toUpperCase()}`
2. **SDK 호출**: `mintclub.network(NETWORK.BASE).token(tokenSymbol).exists()`

```typescript
// TODO 1: 토큰 심볼 생성 - `EWHA${username.toUpperCase()}`
const tokenSymbol = `EWHATEST`; // 수정 필요

// TODO 2: mint.club SDK로 토큰 존재 여부 확인
// mintclub.network(NETWORK.BASE).token(tokenSymbol).exists()
const exists = false; // 수정 필요
```

**💡 해결 방법**: 
```typescript
const tokenSymbol = `EWHA${username.toUpperCase()}`;
const exists = await mintclub.network(NETWORK.BASE).token(tokenSymbol).exists();
```

**✅ 성공 확인**: 콘솔에 "토큰 존재 여부: false" 출력

---

### 🎨 Task 4: 토큰 생성 (6분)

**🎯 목표**: 나만의 EWHA{USERNAME} 토큰 생성하기

**📍 파일**: `hooks/useUserToken.ts`

**핵심 TODO 1개 (3단계):**

**주석 해제 후 수정하기** - 현재 `const result = false;`로 되어 있음

```typescript
// TODO: mint.club 토큰 생성
// mintclub.network(NETWORK.BASE).token(tokenSymbol).create({...})
// const result = await mintclub
//   .network(NETWORK.BASE)
//   .token(tokenSymbol)
//   .create({
//     name: tokenSymbol,
//     reserveToken: {
//       address: NETWORK.ETH_ADDRESS,
//       decimals: USER_TOKEN_CONFIG.DECIMALS,
//     },
//     curveData: {
//       curveType: USER_TOKEN_CONFIG.CURVE_TYPE as const,
//       stepCount: USER_TOKEN_CONFIG.STEP_COUNT,
//       maxSupply: USER_TOKEN_CONFIG.MAX_SUPPLY,
//       initialMintingPrice: USER_TOKEN_CONFIG.INITIAL_PRICE,
//       finalMintingPrice: USER_TOKEN_CONFIG.FINAL_PRICE,
//     },
//   });
const result = false; // 이 줄을 위 코드로 교체

// TODO: 토큰 상태 새로고침 - checkUserToken(username) 호출
await /* TODO: checkUserToken 함수 호출 */ username; // 수정 필요
```

**💡 해결 방법**: 
1. 주석을 해제하고 `const result = false;` 제거
2. `await checkUserToken(username);` 호출

**⚠️ 중요**: 메인넷에서 트랜잭션 비용(가스비)이 발생합니다.

**✅ 성공 확인**: 
- 지갑에서 트랜잭션 승인 팝업
- 토스트 메시지: "토큰이 성공적으로 생성되었습니다! 🎉"
- 프로필에서 "활성화됨" 배지 표시

---

### 🎉 완성!

축하합니다! 여러분은 방금:
- ✅ Farcaster Mini App SDK 연동
- ✅ Web3 사용자 인증 구현  
- ✅ 블록체인 상태 조회
- ✅ 본인만의 토큰 생성

을 완성했습니다!

### 🚀 다음 단계

1. **포스트 생성**: NFT 포스트 만들어보기
2. **토큰 거래**: mint.club에서 토큰 거래해보기
3. **커스텀 기능**: 본인만의 기능 추가해보기

### 🛠️ 문제 해결

#### 자주 발생하는 오류들:

1. **"Network Error"**: 인터넷 연결 확인
2. **"User Rejected"**: 지갑에서 거래 승인 필요  
3. **"Insufficient Funds"**: Base 메인넷 ETH 필요
4. **"Token Already Exists"**: 다른 사용자명으로 시도
5. **빌드 에러**: TODO 주석이 코드 중간에 있으면 안됨 (실제 값으로 교체)
7. **터널 연결 실패**: `ngrok` 설치 확인 또는 다른 터미널에서 실행
8. **색상 테마가 바뀌지 않음**: 강력 새로고침(Shift+Reload) 또는 캐시 비우기 후 확인

#### 도움 요청:
- 🙋‍♂️ 강사에게 손들고 질문
- 💬 옆 사람과 함께 문제 해결
- 🔍 브라우저 개발자 도구 확인

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♂️ 문의사항

프로젝트에 대한 문의사항이 있으시면 Issues를 통해 연락해주세요.

---

**ewhagram** - Ewha × Instagram × Web3

---

## English Guide (Condensed)

### Overview
ewhagram is an Ewha-themed Instagram-like mini app using Farcaster Mini App SDK and mint.club v2.

### Quick Start
1) Clone & Install
```bash
git clone https://github.com/steemhunt/ewhagram.git
cd ewhagram
npm install
```
2) Env
- Copy `.env.example` to `.env.local` and fill values.
- A Filebase API key will be provided during the workshop.
3) Run
```bash
npm run dev
```
4) Optional: expose with ngrok for Mini App testing.

### Workshop TODOs (4–5 tasks)
- Farcaster
  1. Initialize MiniKit and display user context (`app/page.tsx`)
  2. Render profile header with `username`, `pfpUrl`, `fid` (`components/ProfileHeader.tsx`)
- mint.club
  3. Check creator token existence (`hooks/useUserToken.ts`)
  4. Create creator token (on-chain) and refresh state (`hooks/useUserToken.ts`)
  5. Build feed by reserve token → list ERC1155 (`app/feed/page.tsx` or `hooks/useFeed.ts`)

### Session Flow (Suggested)
- 0–5m: Setup & run
- 5–15m: Farcaster context + UI
- 15–30m: Token existence + creation
- 30–40m: Feed fetching (ERC1155 by reserve)

### Troubleshooting
- Network errors: check connectivity
- User rejected: confirm wallet prompt
- Insufficient funds: get Base ETH
- Token already exists: try another username
