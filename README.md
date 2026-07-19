# 산소통 판매 관리 애플리케이션

수산시장 산소통 판매 기사용 모바일 애플리케이션입니다.

## 📋 기능

- ✅ 판매 정보 입력 (업체명, 판매일, 품목, 수량, 수금액, 결제수단)
- ✅ 손가락 서명 기능
- ✅ 판매 내역 조회 및 상세보기
- ✅ 날짜별 자동 정렬
- ✅ SQLite 로컬 DB 저장
- ✅ Excel 내보내기 (XLSX)
- ✅ Zustand 상태 관리

## 🛠️ 기술 스택

- React Native (Expo)
- TypeScript
- Zustand (상태 관리)
- SQLite (로컬 DB)
- ExcelJS (Excel 내보내기)
- React Native Calendars (달력)
- React Native Signature Canvas (서명)

## 📦 설치

### 1. 프로젝트 디렉토리 확인

```bash
cd oxygen-tank-app
```

### 2. 의존성 설치

```bash
npm install
```

또는

```bash
yarn install
```

## 🚀 실행

### Android 에뮬레이터

```bash
npm run android
```

### iOS 시뮬레이터

```bash
npm run ios
```

### 웹 브라우저

```bash
npm run web
```

### Expo 앱으로 실행 (모바일 기기)

```bash
npm start
```

그 후 Expo 앱에서 QR 코드 스캔

## 📁 프로젝트 구조

```
oxygen-tank-app/
├── App.tsx                 # 메인 앱 컴포넌트 (네비게이션)
├── index.ts               # 진입점
├── app.json              # Expo 설정
├── package.json          # 의존성
├── tsconfig.json         # TypeScript 설정
├── babel.config.js       # Babel 설정
│
├── types/
│   └── index.ts          # TypeScript 인터페이스
│
├── store/
│   └── useStore.ts       # Zustand 상태 관리
│
├── services/
│   ├── database.ts       # SQLite 데이터베이스
│   ├── excelService.ts   # Excel 내보내기
│   └── signatureService.ts # 서명 처리
│
├── components/
│   ├── Button.tsx        # 버튼 컴포넌트
│   ├── Card.tsx          # 카드 컴포넌트
│   └── SignaturePad.tsx   # 서명 패드
│
└── screens/
    ├── InputScreen.tsx   # 판매 입력 화면
    ├── ListScreen.tsx    # 판매 리스트 화면
    ├── DetailScreen.tsx  # 상세보기 화면
    └── SettingsScreen.tsx # 설정 화면
```

## 🎯 주요 기능 설명

### 1. 판매 정보 입력 (InputScreen)

- 업체명, 판매일, 품목, 수량, 수금액 입력
- 달력 팝업으로 판매일 선택
- 현금/계좌이체/미수금 3가지 결제수단
- 손가락으로 서명 작성
- 자동 저장

### 2. 판매 리스트 조회 (ListScreen)

- 입력한 모든 판매 내역 표시
- 날짜 역순으로 정렬
- 각 항목 터치로 상세보기
- 새로고침 기능
- Excel 내보내기 버튼

### 3. 상세 보기 (DetailScreen)

- 판매 정보 상세 표시
- 서명 이미지 확인
- 삭제 기능

### 4. 설정 (SettingsScreen)

- 전체 판매 건수 통계
- 총 판매액
- 총 판매 수량
- 애플리케이션 버전

## 💾 데이터 저장

모든 데이터는 기기의 SQLite 로컬 데이터베이스에 저장됩니다.

### 데이터베이스 테이블

```sql
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  companyName TEXT NOT NULL,
  saleDate TEXT NOT NULL,
  productName TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  saleAmount REAL NOT NULL,
  paymentMethod TEXT NOT NULL,
  signature TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

## 📊 Excel 내보내기

리스트 화면에서 "Excel로 내보내기" 버튼을 클릭하면:

1. 모든 판매 내역을 Excel 파일로 생성
2. 자동 합계 계산
3. 금액 포맷팅 적용 (,로 구분)
4. 기기의 공유 기능으로 전송

## 🎨 UI/UX

- 전문적인 파란색 계열 테마
- 직관적인 탭 네비게이션 (입력/리스트/설정)
- 카드 기반 레이아웃
- 명확한 상태 표시

## 🔐 보안

- 데이터는 기기에만 저장
- 클라우드 전송 없음
- 기기 분실 시 데이터 초기화 권장

## 📝 주요 함수

### Database 서비스

- `initDatabase()` - DB 초기화
- `insertSale(sale)` - 판매 정보 저장
- `getAllSales()` - 모든 판매 정보 조회
- `getSaleById(id)` - ID로 판매 정보 조회
- `updateSale(id, sale)` - 판매 정보 수정
- `deleteSale(id)` - 판매 정보 삭제

### Excel 서비스

- `exportToExcel(sales)` - Excel 파일로 내보내기

### Zustand Store

- `addSale(sale)` - 판매 정보 추가
- `getAllSales()` - 모든 판매 정보 조회
- `getSaleById(id)` - ID로 판매 정보 조회
- `updateSale(id, sale)` - 판매 정보 수정
- `deleteSale(id)` - 판매 정보 삭제

## 🐛 문제 해결

### 의존성 설치 오류

```bash
npm install --legacy-peer-deps
```

### 캐시 초기화

```bash
expo prebuild --clean
```

### 에뮬레이터 재시작

Android Studio 또는 Xcode를 통해 에뮬레이터/시뮬레이터 재시작

## 📱 지원 기기

- Android 6.0 이상
- iOS 12.0 이상
- 웹 브라우저 (최신 버전)

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Developed with React Native & Expo

---

**시작하기**: `npm install` → `npm start`
