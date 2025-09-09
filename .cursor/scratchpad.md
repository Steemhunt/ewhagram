# Scratchpad: ewhagram Planning (Planner)

## Background and Motivation (배경 및 목적)
- KR: 이 리포지토리는 1시간 핸즈온 세션(코딩 40분)용 공개 예제로 사용됩니다. 목표는 현재 구현을 유지하면서(동작 변경 없음) 깔끔하고 읽기 쉬운 코드로 리팩터링하고, 초보자도 이해하기 쉬운 한국어 주석과 워크샵 TODO를 제공하는 것입니다.
- EN: This repository will be used for a public 1-hour hands-on session (~40 minutes coding). We aim to keep existing behavior intact while refactoring for clarity, adding Korean-first comments, and preparing student-friendly TODOs.

## Key Challenges and Analysis (핵심 과제 및 분석)
- KR:
  - 동작을 바꾸지 않으면서 최소한의 수정으로 가독성 개선 필요
  - `CreatePostModal.tsx` 등 대형 파일의 복잡성 → 작은 순수 헬퍼로 분리(부작용 없는 함수만)
  - 상수/매직 넘버 분산 → `constants/index.ts`로 집약
  - 초보자 친화적인 한국어 주석과 간단한 로그 필요(불필요한 콘솔 스팸은 금지)
  - 온체인 트랜잭션(가스 비용 허용), Filebase API 키 제공됨
  - 워크샵 브랜치에서 TODO를 제공하되, 컴파일은 깨지지 않도록 안전한 스텁 유지
- EN:
  - Improve readability with minimal edits, no behavior changes
  - Large components (e.g., `CreatePostModal.tsx`) → extract tiny pure helpers only
  - Centralize scattered constants to `constants/index.ts`
  - Add KR-first comments and minimal, clear debug logs
  - On-chain writes allowed; Filebase API key available
  - Provide TODOs on a separate branch without breaking compilation

## High-level Task Breakdown (상위 작업 분해)
1) Refactor pass (no behavior change) / 동작 불변 리팩터링
   - Actions:
     - 한국어 설명 주석 추가(간결하게) + 필요한 최소 로그 추가
     - 순수 유틸만 `lib/`로 소규모 추출(예: 이미지 유틸, 포맷터). import 경로/시그니처 변경 최소화
     - 상수/설정값 `constants/index.ts`로 집약 검토
     - 타입 명확화(외부 사용 시그니처 변경 금지)
   - Target files (우선순위):
     - `components/CreatePostModal.tsx` (부분 헬퍼 추출)
     - `components/ProfileHeader.tsx`, `components/ActivationBanner.tsx`, `components/PostGrid.tsx`
     - `hooks/useUserToken.ts`, `hooks/usePosts.ts`, `hooks/useFeed.ts`
     - `app/feed/page.tsx`, `app/profile/page.tsx`, `app/layout.tsx`, `app/providers.tsx`
   - Success Criteria:
     - 앱 동작/UX 완전히 동일, 빌드 통과
     - 변경은 주로 주석/타입/헬퍼 추출/상수 집약에 국한
     - 주요 로직 시작/에러 지점에 프리픽스 로그 존재(e.g., [EWHAGRAM])

2) Environment updates / 환경 설정 업데이트
   - Actions:
     - `.env.example`에 `NEXT_PUBLIC_FILEBASE_API_KEY=` 예시 값 추가(주: 키는 노출 금지)
     - 코드에서 환경변수 참조가 명확한지 확인(하드코딩 제거 여부 점검)
   - Success Criteria:
     - 로컬에서 `.env.local` 설정만으로 실행 가능
     - 민감정보 하드코딩 없음

3) README revise (KR-first, EN below) / 문서 정리
   - Actions:
     - 빠른 시작(설치/실행), ngrok, 트러블슈팅, 워크샵 플로우(타임라인) 정리
     - 5개 워크샵 TODO 소개(파일 위치, 목표, 성공 기준)
     - 한국어 먼저, 아래에 영어 섹션
   - Success Criteria:
     - 초보자도 순서대로 따라하면 실행/학습 가능
     - 중복/불명확 표현 제거, 최신 코드 상태 반영

4) `workshop-todo` branch: insert 5 student TODOs / 워크샵용 브랜치 생성 및 TODO 삽입
   - TODO list (확정):
     - Farcaster (2):
       1. `app/page.tsx`: MiniKit ready 호출 및 사용자 컨텍스트 표시 (`sdk.actions.ready()`, `username`, `pfpUrl`)
       2. `components/ProfileHeader.tsx`: `fid`, `username`, `pfpUrl` 조건부 렌더링 + 배지
     - mint.club (3):
       3. `hooks/useUserToken.ts`: 사용자 토큰 존재 확인 (`EWHA${USERNAME}`, `.exists()`)
       4. `hooks/useUserToken.ts`: 사용자 토큰 생성 (`.create({...})`), 상태 갱신
       5. `app/feed/page.tsx` 또는 `hooks/useFeed.ts`: Reserve 토큰 기반 ERC1155 페치/렌더링
   - Actions:
     - 위 5개 지점에 KR/EN TODO 주석 추가, 기본 동작은 스텁으로 안전 유지(컴파일 성공)
     - README 워크샵 섹션에서 각 TODO와 링크/파일 위치 참조
   - Success Criteria:
     - 브랜치 체크아웃 시 문제 없이 빌드됨(단, TODO는 미구현 상태)
     - TODO를 채우면 기능이 즉시 동작

5) Final verification / 최종 검증
   - Actions:
     - 개발 서버 구동, 주요 플로우 수동 점검(스플래시 → 프로필 → 토큰 → 포스트 → 피드)
     - 간단한 스크린샷/확인 포인트 기록
   - Success Criteria:
     - 주요 경로 오류 없음, 콘솔 에러 없음(정보 로그만 존재)

## Project Status Board (프로젝트 상태 보드)
- [ ] Refactor pass (no behavior change)
- [ ] Environment updates (.env.example)
- [ ] README revise (KR-first, EN below)
- [ ] Create `workshop-todo` branch and insert 5 TODOs
- [ ] Final verification (run/build/manual check)

## Current Status / Progress Tracking (현재 상태)
- Planner: 초기 계획 문서화 완료. 다음 단계로 리팩터링 착수 예정.
- Timebox: 총 40분 코딩 세션 기준으로 리팩터링은 최소 변경 원칙 준수.

## Executor's Feedback or Assistance Requests (실행자 피드백/요청)
- 대형 파일에서 헬퍼 추출 범위를 최소화해야 동작 위험을 줄일 수 있습니다. 과감한 리팩터링은 피하고, 주석/타입/상수 정리 위주로 진행합니다.
- 워크샵 브랜치의 TODO는 컴파일 유지 스텁으로 제공합니다(학생들이 TODO를 채우면 바로 작동하도록 설계).

## Lessons (학습 노트)
- 공개 세션용 리포지토리는 “동작 불변 + 가독성 향상” 원칙이 가장 안전합니다.
- 학생 과제 TODO는 “짧고 즉시 보상” 형태가 참여도를 높입니다.

Background and Motivation
We need to add a new Instagram-like feed page that surfaces NFTs created on Mint Club where the reserve token is a user’s creator coin on Base Sepolia. We also need a persistent Instagram-style footer navigation (Home, Search, Create, Profile) using lucide-react icons, matching existing Tailwind styling.

Key Challenges and Analysis
- Data sourcing: We must call `https://mint.club/api/tokens/list` with correct query params via ky (instead of axios) and use TanStack Query for caching/loading states.
- Filtering flow: First fetch ERC20 creator coins on Base Sepolia (itemsPerPage=10, v1=false), filter by symbols starting with the user token prefix, then for each reserve token address from that set, fetch ERC1155 tokens (itemsPerPage=3, v1=false) using `reserveToken` param.
- Network identifiers: API expects numeric `chainId` (Base Sepolia = 84532). Our constants currently store a network key string; we’ll use `baseSepolia.id` or add a constant.
- UI consistency: Reuse typography/colors; display a clean feed. Feed should be a single-column full-width image per item, with caption: `SYMBOL - by {reserveToken}` below.
- Navigation: Footer visible across pages; profile link routes to current `/` page; Home routes to `/feed`; Search routes to `/search` (stub page for now) and Create routes to `/` where creation already exists via floating button.

High-level Task Breakdown
1) Footer navigation component
   - Add `components/FooterNav.tsx` using lucide-react icons: Home, Search, Plus, and a profile avatar (from Farcaster context where available; otherwise placeholder).
   - Links: Home -> `/feed`, Search -> `/search` (placeholder page), Plus -> `/` (profile/creation available), Profile -> `/`.
   - Success: Footer is fixed at bottom, responsive, visually aligned with app theme.

2) Feed data hook and types
   - Implement `hooks/useFeed.ts` using TanStack Query and ky.
   - Query A (creator coins): GET tokens with params { chainId: 84532, tokenType: 'ERC20', itemsPerPage: 10, page: 1, v1: false, reserveToken: NETWORK.ETH_ADDRESS }.
   - Filter symbols by prefix (from constants `SYMBOL.USER_TOKEN`).
   - Collect creator coin `tokenAddress` list (deduped).
   - Query B (NFTs): For each creator coin token address, GET tokens with params { chainId: 84532, tokenType: 'ERC1155', itemsPerPage: 3, page: 1, v1: false, reserveToken: <creatorCoinTokenAddress> }.
   - Combine results into a normalized list: { tokenAddress, name, image: metadata.logo, symbol }.
   - Success: Hook returns loading/error/data; memoized stable output.

3) Feed page UI
   - Create `app/feed/page.tsx` as a client component.
   - Use `useFeed` to load data and render a single-column feed with a full-width image (metadata.logo) and caption `symbol - by {reserveToken}` underneath.
   - Loading and empty states styled consistently.
   - Success: Navigating to `/feed` shows a populated grid (when data available), otherwise graceful empty/loading UI.

4) Footer integration into layout
   - Import `FooterNav` in `app/layout.tsx` and render it at the bottom of the body.
   - Ensure main content has bottom padding so content isn’t obscured by the footer.
   - Success: Footer persists across routes and does not overlap content.

5) Search page stub
   - Not required per latest user request.
   - Success: N/A.

6) Constants/Docs
   - Optionally add `CHAIN_ID_BASE_SEPOLIA = 84532` to `constants` or reference `baseSepolia.id` directly.
   - Update `README.md` with instructions on the new feed, API usage, and parameters.
   - Success: Clear README section describing the feed and its data fetching.

Current Status / Progress Tracking
- Planning complete. Awaiting Executor to implement tasks 1–6 sequentially.

Project Status Board
- [ ] Implement footer navigation component (`components/FooterNav.tsx`).
- [ ] Create `hooks/useFeed.ts` with ky + TanStack Query.
- [ ] Build feed page UI at `app/feed/page.tsx` using `useFeed` (single-column design).
- [ ] Integrate footer into `app/layout.tsx` and pad main content.
- [ ] Update constants or reference `baseSepolia.id` for chainId.
- [ ] Update `README.md` to document feed and API usage.

Executor's Feedback or Assistance Requests
- If Plus should open a modal globally instead of linking to `/`, confirm preferred behavior; otherwise we’ll keep it as a link to `/` where creation is available.
- Confirm whether the feed should be a grid (like profile) or a vertical card list; starting with a grid is simplest and consistent.

Lessons
- Prefer using `baseSepolia.id` (84532) to avoid duplicating chain IDs.
- Keep axios requests simple and lean on TanStack Query for caching and retries.
## Background and Motivation
We need to revise the 활성화 (Activate) callout per the provided design. The banner should appear directly below the profile image header and above the image grid. It should only show for connected users who do not yet have a creator coin. The left side explains in Korean that no creator coin exists yet and encourages creation; the right side contains a primary "활성화" button. Emphasize with EWHA green styling (border and accents) and match existing Tailwind/animation style.

## Key Challenges and Analysis
- Token state detection: `useUserToken()` exposes `userToken` (null when not created) and `checkingToken` (loading). The banner must render when `!checkingToken && !userToken`.
- Placement: Inject between `ProfileHeader` and the post grid in `app/page.tsx` to align with the design.
- Avoid duplicate CTAs: The current inline activate button in `components/ProfileHeader.tsx` should be removed/hidden when using the new banner so users see only one primary action.
- Styling consistency: Use existing EWHA Tailwind palette (`bg-ewha-600`, `ring-ewha-600`, etc.) and the app’s typography classes (`text-instagram-*`).
- Logging/observability: Add lightweight logs to verify rendering conditions and clicks, per user rules. Use a single log group to avoid noise.
- Animations/accessibility: Subtle Motion fade/slide; button with `aria-label` and good touch target.

## High-level Task Breakdown
1) Create `components/ActivationBanner.tsx`
   - Functional React + TypeScript, Tailwind.
   - API: `{ checkingToken: boolean; hasToken: boolean; onActivate: () => void; username?: string }`.
   - Render only if `!checkingToken && !hasToken`. Compute `shouldShowBanner` internally and log state.
   - Layout: left text block, right CTA button. Container has `rounded-xl border-2 border-ewha-600 bg-black/30` with subtle shadow; padding consistent with header spacing.
   - Copy (Korean): "아직 크리에이터 코인이 없어요. 지금 생성하고 시작해보세요!"
   - Button label: "활성화"; disabled when `checkingToken` is true.
   - Success criteria: Component compiles with no linter errors; visually matches screenshot style; button fires `onActivate`.

2) Integrate banner in `app/page.tsx`
   - Import and render the banner below `ProfileHeader` and above the grid container.
   - Pass `checkingToken`, `hasToken={!!userToken}`, `onActivate={handleActivate}`, and `username` for logging.
   - Add render log group in `App` for banner condition.
   - Success criteria: Banner appears only when `!checkingToken && !userToken`; otherwise hidden.

3) Update `components/ProfileHeader.tsx`
   - Remove/hide the inline 활성화 button when `!userToken`; keep the "활성화됨" badge when token exists.
   - Success criteria: No duplicate activation CTAs. Header still displays correctly.

4) Add minimal tests for visibility logic (optional, lightweight)
   - If test infra is available, add a React Testing Library test to assert: renders when `!hasToken && !checkingToken`, hides otherwise.
   - If infra is not present, skip and document in Lessons.
   - Success criteria: Tests pass locally.

5) QA and polish
   - Verify states: loading (no banner), no-token (banner visible), token-exists (badge only), click flows create token and refresh posts.
   - Success criteria: Manual checks pass; logs show expected state transitions; no layout regressions on mobile viewport.

## Project Status Board
- [ ] Create `components/ActivationBanner.tsx`
- [ ] Integrate banner in `app/page.tsx`
- [ ] Update `components/ProfileHeader.tsx` to remove inline button
- [ ] Add minimal visibility test (skip if infra heavy)
- [ ] QA states and finalize copy/styles
- [x] Add Base Sepolia RPC fallback in `app/providers.tsx`

## Current Status / Progress Tracking
- Planner finalized the implementation plan and success criteria. Awaiting Executor to start with the component creation task.
- Implemented Base Sepolia RPC fallback transports in `app/providers.tsx` using viem `fallback`, `webSocket`, and `http`; lints pass.

## Executor's Feedback or Assistance Requests
- If testing setup is absent, confirm whether to add Vitest + RTL or skip tests for now.
- Confirm the exact EWHA green shade: Tailwind tokens `border-ewha-600`/`bg-ewha-600` are available; use border emphasis per design.

## Lessons
- Prefer rendering the primary CTA in one location to avoid user confusion.
- Log conditional UI decisions with one grouped message to keep the console readable.
- When configuring Wagmi transports, supply viem transports directly (e.g., `fallback([webSocket(), http()])`) in `createConfig`.

