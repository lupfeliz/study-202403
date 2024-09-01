[TOC]
## JAVA-API 서버

### 1. 개요

2024년 3월 스터디 내용을 토대로 작성한 JAVA-API 서버

- [[관련글보기](https://devlog.ntiple.com/795)]

### 2. 실행방법(개발시)

- `gradlew bootRun` 명령으로 실행한다

```bash
> gradlew bootRun

- Configure project :
================================================================================
데모 API
PROFILE:local
================================================================================

> Task :bootRun
Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts
Standard Commons Logging discovery in action with spring-jcl: please remove commons-logging.jar from classpath in order to avoid potential conflicts

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.4)
... 중략 ...
erAwareRequestFilter@53ef09f, org.springframework.security.web.session.SessionManagementFilter@11a02d20, org.springframework.security.web.access.ExceptionTranslationFilter@4a136d3a, org.springframework.security.web.access.intercept.AuthorizationFilter@477d5d3f
2024-06-16T02:57:56.836+09:00  INFO 34665 --- [demo] [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2024-06-16T02:57:56.870+09:00  INFO 34665 --- [demo] [  restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path ''
2024-06-16T02:57:56.883+09:00  INFO 34665 --- [demo] [  restartedMain] my.was.mywas.MyWasApplication            : Started MyWasApplication in 3.23 seconds (process running for 3.583)
<==========---> 83% EXECUTING [49s]
> :bootRun
```

- 또는 이클립스의 경우 `프로젝트` → `메뉴` → `Run As` → `Spring Boot App` 을 선택하여 실행

### 3. 실행방법(운영시)

- `gradlew build` 명령으로 빌드를 실행한다.

```bash
> gradlew build

- Configure project :
================================================================================
데모 API
PROFILE:local
================================================================================

BUILD SUCCESSFUL in 7s
8 actionable tasks: 8 executed
```
- 빌드된 파일 (`build/libs/my-was-0.0.1.war`) 을 WAS 컨테이너에 설치 한다 (Tomcat 등)


