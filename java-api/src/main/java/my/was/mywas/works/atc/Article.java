/**
 * @File        : Article.java
 * @Author      : 정재백
 * @Since       : 2024-04-16 
 * @Description : 게시물 정보 DTO
 * @Site        : https://devlog.ntiple.com/795
 **/
package my.was.mywas.works.atc;

import java.io.Serializable;
import java.util.Date;

import org.hibernate.annotations.Comment;

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

@Entity
@Table(name = "TB_ARTICLE")
@Schema(title = "게시물 (Article)")
@Comment("게시물 (Article)")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @ToString
public class Article implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Schema(title = "게시글 고유번호")
  private Long id;

  @Column(name = "board_id")
  @Schema(title = "게시판 ID")
  private Long boardId;

  @Column(name = "num", length = 32)
  @Schema(title = "게시글 번호")
  private String num;

  @Column(name = "title", length = 128)
  @Schema(title = "게시글 제목")
  private String title;

  @Column(name = "user_id", length = 32)
  @Schema(title = "글쓴이 ID")
  private String userId;

  @Column(name = "user_nm", length = 32)
  @Schema(title = "글쓴이 이름")
  private String userNm;

  @Column(name = "contents", length = 99999)
  @Schema(title = "내용")
  private String contents;

  @Column(name = "ctime")
  @Schema(title = "생성일시")
  private Date ctime;

  @Column(name = "utime")
  @Schema(title = "수정일시")
  private Date utime;
}