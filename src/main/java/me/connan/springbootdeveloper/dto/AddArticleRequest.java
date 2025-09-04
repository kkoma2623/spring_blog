package me.connan.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AddArticleRequest {
	private String title;
	private String content;

	public Article toEntity() {
		return Article.builder()
			.title(title)
			.content(content)
			.build();
	}

	public Article toEntity(String author) {
		return Article.builder()
			.title(title)
			.content(content)
			.author(author)
			.build();
	}
}
