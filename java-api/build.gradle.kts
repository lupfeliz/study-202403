/**
 * @File        : build.gradle.kts
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : gradle 빌드파일
 * @Site        : https://devlog.ntiple.com/795
 **/
plugins {
  id("java")
  id("war")
  /** spring 관련 */
  id("org.springframework.boot") version "3.2.4"
  id("io.spring.dependency-management") version "1.1.4"
  id("io.freefair.lombok") version "8.1.0"
}

group = "my.was"
version = "0.0.1"

java {
  sourceCompatibility = JavaVersion.VERSION_17
  targetCompatibility = JavaVersion.VERSION_17
}

configurations {
  compileOnly {
    extendsFrom(configurations.annotationProcessor.get())
  }

  all {
    exclude("commons-logging:commons-logging")
    exclude("org.apache.tomcat.embed:tomcat-embed-el")
    exclude("org.apache.tomcat.embed:tomcat-embed-websocket")
  }
}

repositories {
  mavenCentral()
  maven(url = "https://repo.spring.io/milestone")
  maven(url = uri("https://nexus.ntiple.com/repository/maven-public/")).isAllowInsecureProtocol = true
}

dependencies {
  /** lombok 관련 */
  compileOnly("org.projectlombok:lombok")
  annotationProcessor("org.projectlombok:lombok")

  /** spring 베이스 */
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-security")

  providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")

  /** 기타 필요사항들 */
  implementation("commons-codec:commons-codec:1.15")
  implementation("com.ntiple:ntiple-utils:0.0.2-10")
  implementation("javax.validation:validation-api:2.0.1.Final")
  implementation("org.apache.httpcomponents:httpclient:4.5.14")
  implementation("org.apache.httpcomponents:httpmime:4.5.14")

  /** OpenAPI (swagger) */
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")

  /** 런타임 및 개발관련 */
  developmentOnly("org.springframework.boot:spring-boot-devtools")
  developmentOnly("org.springframework.boot:spring-boot-starter-tomcat")
  runtimeOnly("com.h2database:h2")

  /** jwt */
  implementation("io.jsonwebtoken:jjwt-api:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
  runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
  /** yml, json */
  implementation("org.yaml:snakeyaml:2.2")
  implementation("org.json:json:20230618")
  /** 이메일 */
  implementation("com.sun.mail:jakarta.mail:2.0.1")
  /** 로그 */
  implementation("org.logback-extensions:logback-ext-spring:0.1.5")
  /** 기타 libs 폴더에 있는 jar 파일들 */
  implementation (fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))

  /** 테스트관련 */
  testCompileOnly("org.projectlombok:lombok")
  testAnnotationProcessor("org.projectlombok:lombok")
  testImplementation("com.ntiple:ntiple-utils:0.0.2-9")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
}

task("prebuildHook") {
  dependsOn(tasks.named("build"))
  dependsOn(tasks.named("bootRun"))
}

tasks {
  withType<JavaExec> {
    var profile = System.getProperty("spring.profiles.active")
    if (profile == null || "".equals(profile)) { profile = "local" }
    System.setProperty("spring.profiles.active", profile);
    systemProperty("spring.profiles.active", profile)
  }
  named<Test>("test") {
    useJUnitPlatform()
  }
  named<JavaExec>("bootRun") {
    var profile = System.getProperty("spring.profiles.active")
    println("================================================================================")
    println("데모 API")
    println("PROFILE:" + profile)
    println("================================================================================")
  }
}