package me.connan.springbootdeveloper.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.AddArticleRequest;
import me.connan.springbootdeveloper.dto.UpdateArticleRequest;
import me.connan.springbootdeveloper.repository.BlogRepository;

@RequiredArgsConstructor
@Service
public class BlogService {

	private final BlogRepository blogRepository;

	private static void authorizeArticleAuthor(Article article) {
		String userName = SecurityContextHolder.getContext().getAuthentication().getName();
		if (!article.getAuthor().equals(userName)) {
			throw new IllegalArgumentException("not authorized");
		}
	}

	public Article save(AddArticleRequest request) {
		return blogRepository.save(request.toEntity());
	}

	public Article save(AddArticleRequest request, String userName) {
		return blogRepository.save(request.toEntity(userName));
	}

	public List<Article> findAll() {
		return blogRepository.findAll();
	}

	public Article findById(Long id) {
		return blogRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("not found: " + id));
	}

	public void delete(long id) {
		Article article = blogRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("not found : " + id));

		authorizeArticleAuthor(article);
		blogRepository.delete(article);
	}

	@Transactional
	public Article update(long id, UpdateArticleRequest request) {
		Article article = blogRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("not found : " + id));

		authorizeArticleAuthor(article);
		article.update(request.getTitle(), request.getContent());

		return article;
	}

}
