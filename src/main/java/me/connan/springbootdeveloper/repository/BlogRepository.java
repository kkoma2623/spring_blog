package me.connan.springbootdeveloper.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.connan.springbootdeveloper.domain.Article;

public interface BlogRepository extends JpaRepository<Article, Long> {
}
