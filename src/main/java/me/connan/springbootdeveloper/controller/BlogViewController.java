package me.connan.springbootdeveloper.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.AddArticleRequest;
import me.connan.springbootdeveloper.dto.ArticleViewResponse;
import me.connan.springbootdeveloper.dto.UpdateArticleRequest;
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

	@PostMapping("/articles")
	public ResponseEntity<ArticleViewResponse> createArticle(@RequestBody AddArticleRequest request) {
		Article savedArticle = blogService.save(request);
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(new ArticleViewResponse(savedArticle));
	}

	@PutMapping("/articles/{id}")
	public ResponseEntity<ArticleViewResponse> updateArticle(@PathVariable Long id,
		@RequestBody UpdateArticleRequest request) {
		Article updatedArticle = blogService.update(id, request);
		return ResponseEntity.ok(new ArticleViewResponse(updatedArticle));
	}
}
