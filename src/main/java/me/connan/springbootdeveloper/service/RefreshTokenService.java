package me.connan.springbootdeveloper.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.RefreshToken;
import me.connan.springbootdeveloper.repository.RefreshTokenRepository;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {
	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshToken findByRefreshToken(String refreshToken) {
		return refreshTokenRepository.findByRefreshToken(refreshToken)
			.orElseThrow(() -> new IllegalArgumentException("Unexpected refresh token"));
	}
}
