# wordthinker-fe/AGENTS.md

## 프로젝트 개요

- WordThinker는 영단어와 한국어 뜻, 영어 예문을 관리하는 개인 단어장이다.
- Vue 3, Vite, Vue Router, Pinia를 사용하는 JavaScript ES Modules 프로젝트다.
- 단어 추가·수정·삭제, 검색·필터, 학습 상태 관리, 학습 모달을 제공한다.
- 단어 데이터는 브라우저 localStorage에 저장하며, AI 뜻 조회는 n8n 웹훅을 통해 처리한다.
- Node.js 버전은 `package.json`의 `engines` 조건을 따른다. 의존성 설치와 실행은 npm을 사용한다.

## 디렉토리 구조

```text
src/
  main.js                 # 앱 초기화 및 플러그인 등록
  App.vue                 # 최상위 라우트 렌더링
  router/                 # 라우트 정의, 히스토리, 페이지 제목
  layouts/                # 공통 페이지 레이아웃
  pages/                  # 라우트별 화면
  components/layout/      # 공통 헤더와 푸터
  components/vocabulary/  # 단어장 UI와 모달
  components/icons/       # 아이콘 컴포넌트
  composables/            # 재사용 상태와 단어 관리 로직
  services/               # 외부 API 호출
  stores/                 # Pinia 스토어
  assets/                 # 스타일과 이미지
public/                   # 그대로 제공하는 정적 파일
n8n/                      # AI 뜻 조회 워크플로우
scripts/                  # 검증 스크립트
docker-compose.yml        # 로컬 n8n 실행 설정
vite.config.js            # Vite, 경로 별칭, 개발·preview 프록시
```

## 코드 규칙

- 기존 파일의 스타일을 따른다. JavaScript는 2칸 들여쓰기, 작은따옴표, 세미콜론 생략을 기본으로 한다.
- Vue 컴포넌트는 Composition API와 `<script setup>`을 사용한다.
- 컴포넌트와 페이지 파일명은 PascalCase, 함수와 변수는 camelCase, composable은 `use` 접두사를 사용한다.
- `src` 내부 모듈 참조에는 기존 `@/` 경로 별칭을 활용한다.
- 페이지는 화면을 조합하고, 재사용 UI는 `components`, 상태·도메인 로직은 `composables` 또는 `stores`, API 호출은 `services`에 둔다.
- 컴포넌트 간 데이터 전달은 props와 emits를 사용하고, props를 직접 변경하지 않는다.
- 새 페이지는 `src/pages/`에 만들고 `src/router/routes.js`의 공통 레이아웃 하위에 등록한다. 페이지 지연 로딩과 `meta.title`을 유지한다.
- 사용자 안내와 오류 메시지는 기존 한국어 UI와 어조를 맞춘다.
- 비동기 요청은 오류, 로딩 상태, 취소를 처리한다. AI 조회 시 단어 변경·모달 닫기에 따른 취소와 기존 입력에 대한 제안 적용 흐름을 유지한다.
- API 계약이나 실행 설정을 바꾸면 관련 프론트 코드, n8n 워크플로우, README를 함께 확인한다.

## 절대 금지

- API 키, 토큰, 비밀번호 등 비밀값을 소스, 커밋, 로그에 넣지 않는다. OpenAI API 키를 프론트 코드나 `VITE_*` 환경변수에 넣지 않는다.
- 마이그레이션 없이 localStorage 키 `wordy-vocabulary-v1`이나 저장 데이터 형식을 변경하여 기존 단어 데이터를 잃게 하지 않는다.
- 사용자의 요청과 무관한 파일 변경, 기존 작업 덮어쓰기, 데이터 삭제, Git 이력 초기화를 하지 않는다.
- `node_modules/`, `dist/`, 로컬 환경 설정 파일을 커밋하지 않는다. `package-lock.json`은 의존성 변경 시 함께 갱신한다.
- AI 조회의 입력 검증, 호출 제한, 오류 처리, 타임아웃을 임의로 제거하지 않는다.
- 실제 외부 AI 호출이나 n8n 운영 워크플로우 변경을 자동 검증 과정에 포함하지 않는다. 별도로 요청된 경우에만 수행한다.

## PR 규칙

- PR은 하나의 목적에 집중하고, 무관한 리팩터링이나 전체 파일 포맷 변경을 포함하지 않는다.
- 제목과 본문에 해결하려는 문제, 변경 후 동작, 수행한 검증을 명확하게 적는다.
- UI 변경은 가능하면 스크린샷을 첨부하고, API·저장 형식·환경 설정 변경은 호환성과 필요한 적용 절차를 설명한다.
- 새 의존성은 필요한 이유를 설명하고 `package.json`과 `package-lock.json`을 함께 반영한다.
- 실행하지 못한 검증은 이유와 함께 명시한다. 실행하지 않은 테스트를 통과했다고 작성하지 않는다.

## 테스트

- 문서만 변경한 경우에는 내용과 경로, 명령어의 정확성을 확인한다.
- 앱 코드나 빌드 설정 변경 시 `npm run build`로 프로덕션 빌드를 확인한다.
- AI 서비스 또는 n8n 워크플로우 변경 시 `node scripts/check-ai-workflow.mjs`를 실행한다. 이 검증은 실제 AI 호출 없이 워크플로우 로직과 서비스 응답 처리를 확인한다.
- 현재 `package.json`에는 `test`, `lint` 스크립트가 없다. 존재하지 않는 검증 명령을 사용하거나 통과했다고 보고하지 않는다.
- UI 변경 시 `npm run dev`로 관련 기능을 수동 확인한다. 단어 추가·수정·삭제, 검색·필터, 학습 상태, 새로고침 후 저장 유지 중 변경에 영향을 받는 흐름을 점검한다.
- 라우트 변경 시 `/`의 이동, `/vocabulary` 직접 접속, 새로고침, 404 화면을 확인한다. 정적 배포에서는 앱 경로를 `index.html`로 연결하는 서버 설정이 필요하다.
- AI UI 변경 시 성공·오류·타임아웃·취소와 기존 입력에 대한 제안 적용을 확인한다. 실제 n8n 연동 검증에는 실행 중인 n8n과 게시된 워크플로우가 필요하다.
