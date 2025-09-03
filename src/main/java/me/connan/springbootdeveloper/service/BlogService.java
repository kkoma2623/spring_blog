package me.connan.springbootdeveloper.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.Article;
import me.connan.springbootdeveloper.dto.AddArticleRequest;
import me.connan.springbootdeveloper.repository.BlogRepository;

@RequiredArgsConstructor
@Service
public class BlogService {

	private final BlogRepository blogRepository;

	public Article save(AddArticleRequest request) {
		return blogRepository.save(request.toEntity());
	}

	public List<Article> findAll() {
		return blogRepository.findAll();
	}

	public Article findById(Long id) {
		return blogRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("not found: " + id));
	}
}
