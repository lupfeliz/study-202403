/**
 * @File        : ServletInitializer
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : Springboot WAS 컨테이너 엔트리 포인트
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {
  @Override protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(MyWasApplication.class);
  }
}
