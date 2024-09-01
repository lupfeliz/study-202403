[TOC]
## NEXTJS-WEB Frontend

### 1. 개요

2024년 3월 스터디 내용을 토대로 작성한 WEB Frontend

- [[관련글보기](https://devlog.ntiple.com/795)]

### 2. 실행방법(개발시)

- `npm run dev` 명령으로 실행한다

```bash
$ npm run dev

> my-next-app@0.1.0 dev
> next dev
================================================================================
샘플앱 / 프로파일 : local / 구동모드 : dev / API프록시 : http://localhost:8080
================================================================================
  ▲ Next.js 14.2.7
  - Local:        http://localhost:3000
 ✓ Starting...
 ✓ Ready in 2.3s
 ○ Compiling /_error ...
 ✓ Compiled / in 5.7s (1032 modules)
 GET / 200 in 5598ms
```

### 3. 실행방법(운영시)

- `npm run build` 명령으로 빌드를 실행한다.

```bash
$ npm run build

> my-app@0.1.0 build
> next build
================================================================================
샘플앱 / 프로파일 : local / 구동모드 : build / API프록시 : http://localhost:8080
================================================================================
  ▲ Next.js 14.2.7
 ✓ Linting and checking validity of types    

... 중략 ...

+ First Load JS shared by all              233 kB
  ├ chunks/framework-ecc4130bc7a58a64.js   45.2 kB
  ├ chunks/main-49d125ccecdddcc4.js        36.7 kB
  ├ chunks/pages/_app-69ccd414d775482f.js  149 kB
  └ other shared chunks (total)            2.3 kB
○  (Static)  prerendered as static content
```

- `npm run start` 명령으로 서버를 구동한다

```bash
$ npm run start

> my-app@0.1.0 start
> next start
  ▲ Next.js 14.2.7
  - Local:        http://localhost:3000
 ✓ Starting...
================================================================================
샘플앱 / 프로파일 : local / 구동모드 : start / API프록시 : http://localhost:8080
================================================================================
 ✓ Ready in 627ms
```



