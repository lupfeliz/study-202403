/**
 * @File        : UserController.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원관리 컨트롤러
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.usr;

import static my.was.mywas.commons.RestResponse.response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import my.was.mywas.commons.CommonEntity.Result;

@Slf4j @RestController
@RequestMapping("/api/usr")
public class UserController {

  private static final String CONTROLLER_TAG1 = "사용자 API"; 

  @Autowired UserService usrservice;

  @PostConstruct public void init() {
    log.trace("INIT:{}", UserController.class);
  }

  @Operation(summary = "아이디 중복확인 (usr01001a01)", tags = { CONTROLLER_TAG1 })
  @GetMapping("/usr01001/{userId}")
  public ResponseEntity<Result> usr01001a01(
    @PathVariable(value = "userId") @Parameter(description = "사용자 ID") String userId) {
    return response(() -> usrservice.usr01001a01(userId));
  }

  @Operation(summary = "회원가입 (usr01001a02)", tags = { CONTROLLER_TAG1 })
  @PutMapping("/usr01001")
  public ResponseEntity<Result> usr01001a02(@RequestBody User prm) {
    return response(() -> usrservice.usr01001a02(prm));
  }

  @Operation(summary = "마이페이지 정보조회 (usr01002a01)", tags = { CONTROLLER_TAG1 })
  @GetMapping("/usr01002/{userId}")
  public ResponseEntity<User> usr01002a01(
    @PathVariable(value = "userId") @Parameter(description = "사용자 ID") String userId) {
    return response(() -> usrservice.usr01002a01(userId));
  }

  @Operation(summary = "마이페이지 수정 (usr01002a02)", tags = { CONTROLLER_TAG1 })
  @PutMapping("/usr01002")
  public ResponseEntity<Result> usr01002a02(@RequestBody User prm) {
    return response(() -> usrservice.usr01002a02(prm));
  }

  @Operation(summary = "회원정보 삭제 (usr01002a03)", tags = { CONTROLLER_TAG1 })
  @DeleteMapping("/usr01002/{userId}")
  public ResponseEntity<Result> usr01002a03(
    @PathVariable(value = "userId") @Parameter(description = "사용자 ID") String userId) {
    return response(() -> usrservice.usr01002a03(userId));
  }
}