# WordThinker

Vue 3, Vite, Vue Router 기반의 개인 단어장입니다.

## 실행

```sh
npm install
npm run dev
npm run build
npm run preview
```

## 구조

- `src/App.vue`: 최상위 라우트 렌더링
- `src/router/index.js`: 브라우저 히스토리, 스크롤 복원, 페이지 제목
- `src/router/routes.js`: 라우트 정의 및 페이지 지연 로딩
- `src/layouts/DefaultLayout.vue`: 공통 헤더, 본문, 푸터
- `src/pages/`: 라우트별 화면
- `src/components/`: 재사용 UI 컴포넌트
- `src/composables/useVocabulary.js`: 단어 관리 및 브라우저 저장

## 라우트

| 경로 | 화면 |
| --- | --- |
| `/` | `/vocabulary`로 이동 |
| `/vocabulary` | 단어장 (추가, 수정, 검색, 필터, 학습) |
| 그 외 | 404 및 단어장 복귀 링크 |

새 화면은 `src/pages/`에 추가하고 `src/router/routes.js`의 레이아웃 하위 라우트에 등록합니다.

HTML5 히스토리 모드를 사용하므로 배포 서버는 정적 파일 외의 앱 경로를 `index.html`로 연결해야 합니다. 그래야 직접 접속과 새로고침이 동작합니다.

기존 단어를 유지하기 위해 localStorage 키 `wordy-vocabulary-v1`은 계속 사용합니다.

## AI로 뜻 찾기 (n8n + Docker)

단어 추가/수정 창에서 영단어를 입력하고 **AI로 뜻 찾기**를 누르면 한국어 뜻과 영어 예문을 가져옵니다. 기존 입력이 있으면 제안을 확인하고 적용할 수 있습니다. 결과는 저장하기를 눌러야 저장됩니다.

### 연결 순서

1. Docker Desktop을 실행한 뒤 프로젝트 루트에서 `docker compose up -d`를 실행합니다.
2. `http://localhost:5678`에 접속하여 최초 관리자 계정을 만듭니다.
3. n8n에서 **Import from File**로 [`n8n/word-meaning.workflow.json`](n8n/word-meaning.workflow.json)을 가져옵니다.
4. **Look up with OpenAI** 노드에서 OpenAI credential을 생성/선택하고 자신의 OpenAI API 키를 저장합니다. 모델은 `gpt-4.1-mini`이며 JSON Body에서 변경할 수 있습니다. API 사용 비용은 해당 OpenAI 계정에 청구됩니다.
5. 워크플로우를 저장하고 **Publish**(구버전에서는 **Active**)합니다. 프론트는 테스트 URL이 아닌 `/webhook/word-meaning`을 호출합니다.
6. `npm run dev`로 프론트를 실행합니다. 이미 실행 중이었다면 Vite 설정 반영을 위해 재시작합니다.

API 키를 프론트 코드나 `VITE_*` 환경변수에 넣지 않습니다. n8n 데이터와 credential은 Docker의 `n8n_data` 볼륨에 보존됩니다. Compose는 로컬 PC의 5678 포트에만 바인딩합니다.

기본 연결은 `브라우저 → /api/ai/word-meaning → Vite 프록시 → http://localhost:5678/webhook/word-meaning → OpenAI`입니다. 개발/preview 모두 프록시를 사용하므로 브라우저 CORS 설정이 필요 없습니다. 다른 호스트를 사용할 때는 `.env.example`을 `.env.local`로 복사하고 `N8N_BASE_URL`을 바꾼 뒤 Vite를 재시작합니다. 프론트 개발 서버도 Docker 안에서 실행한다면 같은 네트워크의 `http://n8n:5678`을 사용합니다.

### 요청과 응답

의미 생성은 워크플로우 전체에서 하루 200회로 제한하며 한국 시간 자정에 초기화합니다. 유효한 AI 요청은 실패하거나 취소해도 횟수에 포함되고, 초과 요청은 AI 호출 없이 429와 안내 문구를 반환합니다. 횟수는 n8n static data에 저장하므로 활성화된 운영 웹훅을 사용해야 합니다. 동시 요청이 한도를 넘지 않도록 Compose의 운영 실행 동시성을 1로 설정했습니다.

기존 설치는 `docker compose up -d` 실행 후 수정된 JSON을 기존 워크플로우에 가져와 credential을 확인하고 저장 및 Publish하세요. 새 워크플로우를 만들면 기존 사용 횟수는 이어지지 않습니다.

```http
POST http://localhost:5678/webhook/word-meaning
Content-Type: application/json

{"word":"serendipity"}
```

성공 응답 예시:

```json
{
  "word": "serendipity",
  "meaning": "(명사) 뜻밖의 행운, 우연한 발견",
  "example": "It was pure serendipity that we met."
}
```

입력 오류는 400, 뜻을 찾을 수 없으면 422, AI 호출/응답 오류는 502와 `{"error":"안내 문구"}`를 반환합니다. AI 호출은 35초, 프론트 대기는 45초로 제한합니다. 단어를 바꾸거나 창을 닫으면 프론트 요청을 취소합니다(이미 시작한 AI 실행은 계속될 수 있습니다).

### 정적 배포 시

`npm run build` 결과에는 Vite 프록시가 포함되지 않습니다. 배포 서버에서 `/api/ai/word-meaning`을 n8n의 `/webhook/word-meaning`으로 프록시해야 합니다. 공개 서비스에서는 이 서버 경로에 사용자 인증과 호출 제한도 적용하세요. 예를 들어 같은 호스트의 nginx에는 다음 location을 설정합니다.

```nginx
location = /api/ai/word-meaning {
    proxy_pass http://127.0.0.1:5678/webhook/word-meaning;
    proxy_read_timeout 45s;
}
```

구성 참고: [n8n Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/), [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
