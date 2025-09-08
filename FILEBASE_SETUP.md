# Filebase 설정 가이드

Yeonstagram은 이미지와 메타데이터를 IPFS에 저장하기 위해 Filebase를 사용합니다.

## 설정 단계

1. **Filebase 계정 생성**
   - https://filebase.com/ 에서 가입하세요

2. **IPFS 버킷 생성**
   - https://console.filebase.com/buckets 로 이동
   - "Create Bucket" 클릭
   - Bucket Type: "IPFS" 선택
   - Bucket Name 입력 (예: "yeonstagram")

3. **API 키 생성**
   - https://console.filebase.com/buckets 에서 "Access Keys" 탭으로 이동
   - "Choose Bucket To Generate Token" 클릭
   - 생성한 버킷 이름 선택
   - API 키가 생성됩니다

4. **환경 변수 설정**
   - 프로젝트 루트에 `.env.local` 파일 생성
   - 다음 내용 추가:
   ```
   FILEBASE_API_KEY=여기에_API_키_붙여넣기
   ```
   
   **주의**: 이 API 키는 서버 사이드에서만 사용되므로 보안이 강화됩니다.

5. **서버 재시작**
   - 개발 서버를 재시작하세요 (`npm run dev`)

## 주의사항

- API 키는 절대 공개 저장소에 커밋하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 서버 사이드에서만 사용되므로 클라이언트에 노출되지 않아 보안이 안전합니다
- Filebase 무료 계정은 월 5GB 저장 공간과 20GB 대역폭을 제공합니다

## 테스트용 설정

개발/테스트를 위해 다음 내용을 `.env.local`에 추가하세요:

```
FILEBASE_API_KEY=your_actual_filebase_api_key
```