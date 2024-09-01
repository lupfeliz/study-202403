/**
 * @File        : MyWasApplication.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Springboot 구동 파일
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MyWasApplication {
  public static void main(String[] args) {
    String profile = System.getProperty("spring.profiles.active");
    if (profile == null || "".equals(profile)) {
      System.setProperty("spring.profiles.active", "local");
    }
    SpringApplication.run(MyWasApplication.class, args);
  }
}