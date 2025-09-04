package me.connan.springbootdeveloper.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.ArticleViewResponse;
import me.connan.springbootdeveloper.service.BlogService;

@RequiredArgsConstructor
@Controller
public class BlogViewController {

	private final BlogService blogService;

	@GetMapping("/articles")
	public ResponseEntity<List<ArticleViewResponse>> getArticles(Model model) {
		List<ArticleViewResponse> articles = blogService.findAll()
			.stream()
			.map(ArticleViewResponse::new)
			.toList();
		model.addAttribute("articles", articles);

		return ResponseEntity.ok()
			.body(articles);
	}

	@GetMapping("/articles/{id}")
	public ResponseEntity<ArticleViewResponse> getArticle(@PathVariable Long id, Model model) {
		Article article = blogService.findById(id);
		ArticleViewResponse articleViewResponse = new ArticleViewResponse(article);
		model.addAttribute("article", articleViewResponse);

		return ResponseEntity.ok()
			.body(articleViewResponse);
	}
}
