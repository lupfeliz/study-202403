/**
 * @File        : ArticleController.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 컨트롤러
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.atc;

import static my.was.mywas.commons.RestResponse.response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.Result;
import my.was.mywas.commons.CommonEntity.SearchEntity;

@Slf4j @RestController
@RequestMapping("/api/atc")
public class ArticleController {

  static final String CONTROLLER_TAG1 = "게시글 API"; 

  @Autowired ArticleService service;
  @PostConstruct public void init() {
    log.trace("INIT:{}", ArticleController.class);
  }

  @Operation(summary = "게시물 저장/수정 (atc01001a01)", tags = { CONTROLLER_TAG1 })
  @PutMapping("/atc01001")
  public ResponseEntity<Result> atc01001a01(
    @RequestBody Article prm) {
    return response(() -> service.atc01001a01(prm));
  }

  @Operation(summary = "게시글 조회 (atc01001a02)", tags = { CONTROLLER_TAG1 })
  @GetMapping("/atc01001/{id}")
  public ResponseEntity<Article> atc01001a02(
    @PathVariable(value = "id") @Parameter(description = "게시물 고유번호") Long id) {
    return response(() -> service.atc01001a02(id));
  }

  @Operation(summary = "게시글 삭제 (atc01001a03)", tags = { CONTROLLER_TAG1 })
  @DeleteMapping("/atc01001/{id}")
  public ResponseEntity<Result> atc01001a03(
    @PathVariable(value = "id") @Parameter(description = "게시물 고유번호") Long id) {
    return response(() -> service.atc01001a03(id));
  }

  @Operation(summary = "게시글 검색 (atc01001a04)", tags = { CONTROLLER_TAG1 })
  @PostMapping("/atc01001")
  public ResponseEntity<SearchEntity<Article>> atc01001a04(
    @RequestBody SearchEntity<?> prm) {
    return response(() -> service.atc01001a04(prm));
  }
}
