# 프로젝트: 간단한 퍼즐 게임

## 목표
- 브라우저에서 실행되는 퍼즐 게임

## 기능
- 퍼즐 보드 표시
- 클릭 이벤트 처리
- 클리어 조건 판단
- 4x4 퍼즐로 2개의 동일한 과일 이미지를 맞추는 게임

## 기술
- 단순 HTML, CSS, Javascript
- 하나의 index.html 파일, CSS 파일, JS 파일
- UI 텍스트는 한글

## 폴더 구조
```text
puzzle-game/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js      -- 앱 시작점, 이벤트 연결, 초기 실행
│  ├─ board.js    -- 퍼즐 보드와 화면 렌더링
│  ├─ game.js     -- 게임 상태, 클릭 처리, 정답 판정
│  └─ utils.js    -- 랜덤 섞기, localStorage 공통 함수
├─ assets/
│  └─ images/
└─ PRD.md
```

## 대상
- 코딩 쌉고수