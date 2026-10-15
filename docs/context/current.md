# 현재 작업 체크포인트

- 갱신일: 2026-10-16
- 상태: 완료

## 목표와 완료 조건
- 요청: 컨텍스트 GC 구조 추가.
- 하네스에 작업 맥락의 정리·보존·복원 절차와 체크포인트, 아카이브 구조를 추가하고 시작·종료 지침에 연결한다.

## 제약과 보존할 변경
- 앱·백엔드·인프라 변경 없이 저장소 지침과 문서만 수정한다.
- 시작 전 기존 변경: 루트 및 프론트 AGENTS.md, 프론트 README.md, package.json, package-lock.json, node_modules 내 추적 파일 수정, .eslintrc.js 삭제, eslint.config.js와 docs/ 미추적 상태. 해당 변경을 되돌리지 않는다.

## 진행과 결정
- 루트 및 프론트 AGENTS.md에 체크포인트 읽기와 GC 갱신 절차를 연결했다.
- docs/frontend-harness.md에 GC 안내를 연결했다.
- docs/context/README.md에 복원 순서, GC 시점, 보존 기준, 체크포인트 양식을 추가했다.
- docs/context/archive/README.md에 기록 보관 규칙을 추가했다.
- GC는 에이전트가 수행하는 문서 정리 절차다. 자동 대화 삭제나 컨텍스트 창 제어 기능은 구현하지 않았다.

## 검증
- 문서 경로와 상대 링크 대상을 확인했고, `git diff --check`를 통과했다.
- 문서만 변경하여 앱 빌드·lint·브라우저 검증은 실행하지 않는다.

## 남은 작업과 다음 행동
- 추가 구현이나 API 연동 의존성 없음.
- 다음 작업 시작 시 현재 사용자 요청과 Git 상태를 확인하고 이 체크포인트를 갱신한다.

## 참고
- [GC 절차](README.md)
- [프론트 하네스](../frontend-harness.md)
