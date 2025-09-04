package me.connan.springbootdeveloper.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.ArticleViewResponse;
import me.connan.springbootdeveloper.service.BlogService;

@RequiredArgsConstructor
@RestController
public class BlogViewController {

	private final BlogService blogService;

	@GetMapping("/articles")
	public ResponseEntity<List<ArticleViewResponse>> getArticles() {
		List<ArticleViewResponse> articles = blogService.findAll()
			.stream()
			.map(ArticleViewResponse::new)
			.toList();

		return ResponseEntity.ok()
			.body(articles);
	}

	@GetMapping("/articles/{id}")
	public ResponseEntity<ArticleViewResponse> getArticle(@PathVariable Long id) {
		Article article = blogService.findById(id);
		ArticleViewResponse articleViewResponse = new ArticleViewResponse(article);

		return ResponseEntity.ok()
			.body(articleViewResponse);
	}

	@PostMapping("/new-article")
	public ResponseEntity<ArticleViewResponse> newArticle(@RequestParam(required = false) Long id) {
		if (id == null) {
			return ResponseEntity.status(HttpStatus.CREATED)
				.body(new ArticleViewResponse());
		}
		Article article = blogService.findById(id);
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(new ArticleViewResponse(article));
	}
}
