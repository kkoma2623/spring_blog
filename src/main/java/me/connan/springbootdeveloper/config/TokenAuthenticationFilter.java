package me.connan.springbootdeveloper.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.config.jwt.TokenProvider;

@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {
	private final static String HEADER_AUTHORIZATION = "Authorization";
	private final static String TOKEN_PREFIX = "Bearer ";
	private final TokenProvider tokenProvider;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
		@NonNull FilterChain filterChain) throws ServletException, IOException {

		// 요청 헤더의 Authorization 키의 값 조회
		String authorizationHeader = request.getHeader(HEADER_AUTHORIZATION);
		// 가져온 값에서 접두사 제거
		String token = getAccessToken(authorizationHeader);

		// 가져온 토큰이 유효한지 확인하고 유효한 때는 인증 정보 설정
		if (tokenProvider.validToken(token)) {
			Authentication authentication = tokenProvider.getAuthentication(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}
		filterChain.doFilter(request, response);
	}

	private String getAccessToken(String authorizationHeader) {
		if (authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX)) {
			return authorizationHeader.substring(TOKEN_PREFIX.length());
		}
		return null;
	}
}
