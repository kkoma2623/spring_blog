package me.connan.springbootdeveloper.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.AddArticleRequest;
import me.connan.springbootdeveloper.dto.ArticleResponse;
import me.connan.springbootdeveloper.service.BlogService;

@RequiredArgsConstructor
@RestController
public class BlogApiController {

	private final BlogService blogService;

	@PostMapping("/api/articles")
	public ResponseEntity<Article> addArticle(@RequestBody AddArticleRequest request) {

		Article savedArticle = blogService.save(request);

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(savedArticle);
	}

	@GetMapping("/api/articles")
	public ResponseEntity<List<ArticleResponse>> getAllArticles() {
		List<ArticleResponse> articles = blogService.findAll()
			.stream()
			.map(ArticleResponse::new)
			.toList();

		return ResponseEntity.ok()
			.body(articles);
	}

	@GetMapping("/api/articles/{id}")
	public ResponseEntity<ArticleResponse> findArticle(@PathVariable("id") Long id) {
		Article article = blogService.findById(id);

		return ResponseEntity.ok()
			.body(new ArticleResponse(article));
	}
}
