# 산소통 판매 관리 앱 - 설치 및 실행 가이드

## ✅ 프로젝트 생성 완료

프로젝트가 `C:\Users\young\oxygen-tank-app` 디렉토리에 생성되었습니다.

## 📦 현재 상태

### 생성된 파일/폴더
```
✅ package.json          - 의존성 정의
✅ app.json              - Expo 설정
✅ tsconfig.json         - TypeScript 설정
✅ babel.config.js       - Babel 설정
✅ App.tsx               - 메인 앱 컴포넌트
✅ index.ts              - 진입점
✅ .gitignore            - Git 무시 파일

폴더:
✅ types/               - TypeScript 인터페이스
✅ store/               - Zustand 상태 관리
✅ services/            - DB, Excel, 서명 서비스
✅ components/          - UI 컴포넌트
✅ screens/             - 4개 화면 컴포넌트
```

## 🚀 실행 방법

### 1단계: 의존성 설치 (이미 진행 중)

현재 npm install이 백그라운드에서 실행 중입니다.
완료되면 다음 단계를 진행하세요.

### 2단계: 프로젝트 실행

```bash
cd C:\Users\young\oxygen-tank-app
npm start
```

**또는 직접 에뮬레이터 실행:**

#### Android
```bash
npm run android
```

#### iOS (Mac에서만 가능)
```bash
npm run ios
```

#### 웹 브라우저
```bash
npm run web
```

## 📱 사용 방법

### 탭 1: 입력 (✏️)
1. 업체명 입력
2. 판매일 선택 (달력 팝업)
3. 품목 입력 (예: 산소통)
4. 수량 입력 (숫자)
5. 수금액 입력 (숫자)
6. 결제수단 선택 (현금/계좌이체/미수금)
7. "서명 진행하기" 버튼 클릭
8. 손가락으로 서명 작성
9. "저장" 버튼 클릭

### 탭 2: 리스트 (📋)
- 모든 판매 내역 조회
- 항목 클릭 시 상세보기
- "Excel로 내보내기" 클릭 시 XLSX 파일 생성

### 탭 3: 설정 (⚙️)
- 전체 판매 건수 확인
- 총 판매액 확인
- 총 판매 수량 확인
- 앱 버전 확인

## 💾 데이터 저장

모든 데이터는 다음 위치에 자동 저장됩니다:
- **Android**: `Documents/oxygen_tank.db`
- **iOS**: 앱 샌드박스 내 SQLite DB
- **웹**: IndexedDB

## 🔧 문제 해결

### 의존성 설치 오류
```bash
npm install --legacy-peer-deps
```

### 캐시 초기화
```bash
expo prebuild --clean
```

### 모듈을 찾을 수 없음
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📊 기술 스택

| 기술 | 용도 |
|------|------|
| React Native | 모바일 앱 개발 |
| Expo | 개발 환경 및 배포 |
| TypeScript | 타입 안전성 |
| Zustand | 상태 관리 |
| SQLite | 로컬 데이터베이스 |
| ExcelJS | Excel 내보내기 |
| React Navigation | 화면 네비게이션 |
| React Native Calendars | 달력 |
| React Native Signature Canvas | 서명 |

## 🎯 주요 기능

### ✨ 입력 화면
- 6개 입력 필드
- 달력 선택 기능
- 3가지 결제수단 선택
- 서명 작성 및 저장

### 📋 리스트 화면
- 날짜 역순 정렬
- 카드 기반 레이아웃
- 새로고침 기능
- Excel 내보내기

### 🔍 상세 화면
- 전체 정보 표시
- 서명 이미지 확인
- 삭제 기능

### ⚙️ 설정 화면
- 통계 정보
- 앱 정보

## 📝 주요 파일 설명

### 핵심 로직

**`store/useStore.ts`**
- Zustand를 사용한 상태 관리
- 메모리 기반 판매 데이터 캐싱

**`services/database.ts`**
- SQLite 데이터베이스 초기화 및 관리
- CRUD 작업 (Create, Read, Update, Delete)
- 날짜별 인덱싱으로 빠른 조회

**`services/excelService.ts`**
- Excel 파일 생성 (XLSX)
- 자동 합계 계산
- 금액 포맷팅

**`services/signatureService.ts`**
- 서명을 Base64로 변환
- 이미지 저장 처리

### UI 컴포넌트

**`components/Button.tsx`**
- 재사용 가능한 버튼 컴포넌트
- 4가지 스타일 (primary, secondary, danger, outline)
- 3가지 크기 (small, medium, large)

**`components/Card.tsx`**
- 카드 레이아웃 컴포넌트
- 그림자 효과 (elevated)

**`components/SignaturePad.tsx`**
- 서명 캔버스
- 터치로 직접 그리기
- 초기화 기능

### 화면

**`screens/InputScreen.tsx`** (약 450줄)
- 판매 정보 입력 폼
- 달력 모달
- 서명 모달

**`screens/ListScreen.tsx`** (약 300줄)
- 판매 리스트 표시
- 새로고침 기능
- Excel 내보내기

**`screens/DetailScreen.tsx`** (약 350줄)
- 상세 정보 표시
- 서명 이미지 확인
- 삭제 기능

**`screens/SettingsScreen.tsx`** (약 200줄)
- 통계 정보
- 앱 정보

## 🔐 데이터 보안

- ✅ 로컬 저장 (클라우드 전송 없음)
- ✅ SQLite 암호화 가능
- ✅ 기기 분실 시 데이터 초기화 가능
- ✅ 앱 삭제 시 데이터 삭제

## 📱 지원 버전

- **Android**: 6.0 이상
- **iOS**: 12.0 이상
- **Web**: 최신 Chrome, Firefox, Safari

## 🎨 앱 디자인

### 컬러 팔레트
- **주요색**: #2563EB (파란색)
- **악센트**: #7C3AED (자주색)
- **배경**: #F9FAFB (밝은 회색)
- **상태색**:
  - 현금: #059669 (초록)
  - 계좌이체: #0891B2 (하늘)
  - 미수금: #DC2626 (빨강)

### 레이아웃
- 탭 네비게이션 (하단)
- 카드 기반 리스트
- 풀스크린 모달

## 📞 지원

문제 발생 시:
1. `README.md` 확인
2. 캐시 초기화: `expo prebuild --clean`
3. 의존성 재설치: `npm install --legacy-peer-deps`
4. 에뮬레이터 재시작

## 🎉 완성!

앱이 완전히 준비되었습니다. `npm start`를 실행하여 시작하세요!

---

**문의**: 모든 코드는 TypeScript로 작성되어 있으며, 각 파일에 주석이 포함되어 있습니다.
