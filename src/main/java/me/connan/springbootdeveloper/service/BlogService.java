package me.connan.springbootdeveloper.service;

import java.util.List;

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

	public void delete(Long id) {
		blogRepository.deleteById(id);
	}

	@Transactional
	public Article update(Long id, UpdateArticleRequest request) {
		Article article = this.findById(id);

		article.update(request.getTitle(), request.getContent());

		return article;
	}
}
