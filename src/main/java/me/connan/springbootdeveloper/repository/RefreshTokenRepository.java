package me.connan.springbootdeveloper.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import me.connan.springbootdeveloper.domain.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByUserId(Long id);

	Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
