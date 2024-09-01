/**
 * @File        : OpenAPIConfig.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : swagger 설정파일
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@OpenAPIDefinition(servers = { @Server(url = "/", description = "기본URL") })
@Configuration public class OpenAPIConfig {
  @Bean public OpenAPI customOpenAPI() {
    final String secureScheme = "인증전송자(Bearer)";
    return new OpenAPI()
      .addSecurityItem(new SecurityRequirement().addList(secureScheme))
      .components(new Components()
        .addSecuritySchemes(secureScheme, new SecurityScheme()
          .name(secureScheme)
          .type(SecurityScheme.Type.HTTP)
          .scheme("bearer")
          .bearerFormat("JWT")))
      .info(new Info().title("데모 프로그램"));
  }
}