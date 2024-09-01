/**
 * @File        : User.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 회원관리 정보 DTO
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.usr;

import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import my.was.mywas.commons.CommonEntity.SecureOut;

@Entity
@Table(name = "TB_USER")
@Schema(title = "사용자 (User)")
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @Builder @ToString @SecureOut
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Schema(title = "사용자 고유번호")
  private Long id;

  @Column(name = "user_id", length = 32, unique = true)
  @Schema(title = "사용자 아이디")
  private String userId;

  @Column(name = "user_nm", length = 32)
  @Schema(title = "사용자 이름")
  private String userNm;

  @Column(name = "passwd", length = 128)
  @Schema(title = "사용자 비밀번호")
  @SecureOut private String passwd;

  @Column(name = "email", length = 128)
  @Schema(title = "사용자 이메일")
  private String email;

  @Column(name = "ctime")
  @Schema(title = "생성일시")
  private Date ctime;

  @Column(name = "utime")
  @Schema(title = "수정일시")
  private Date utime;
}
