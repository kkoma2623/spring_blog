package me.connan.springbootdeveloper.config.oauth;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.config.jwt.TokenProvider;
import me.connan.springbootdeveloper.domain.RefreshToken;
import me.connan.springbootdeveloper.domain.User;
import me.connan.springbootdeveloper.repository.RefreshTokenRepository;
import me.connan.springbootdeveloper.service.UserService;
import me.connan.springbootdeveloper.util.CookieUtil;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	public static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
	public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14);
	public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1);
	public static final String REDIRECT_PATH = "http://localhost:3000/naver/callback";

	private final TokenProvider tokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;
	private final OAuth2AuthorizationRequestBasedOnCookieRepository authorizationRequestRepository;
	private final UserService userService;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException {
		OAuth2User oAuth2User = (OAuth2User)authentication.getPrincipal();

		// 네이버는 response 객체 안에 email이 있음
		String email = null;
		Map<String, Object> attributes = oAuth2User.getAttributes();
		Map<String, Object> naverResponse = (Map<String, Object>)attributes.get("response");

		email = (String)Objects.requireNonNullElse(naverResponse, attributes).get("email");

		User user = userService.findByEmail(email);

		String refreshToken = tokenProvider.generateToken(user, REFRESH_TOKEN_DURATION);
		saveRefreshToken(user.getId(), refreshToken);
		addRefreshTokenToCookie(request, response, refreshToken);

		String accessToken = tokenProvider.generateToken(user, ACCESS_TOKEN_DURATION);
		String targetUrl = getTargetUrl(accessToken);

		clearAuthenticationAttributes(request, response);

		getRedirectStrategy().sendRedirect(request, response, targetUrl);
	}

	private void saveRefreshToken(Long userId, String newRefreshToken) {
		RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId)
			.map(entity -> entity.update(newRefreshToken))
			.orElse(new RefreshToken(userId, newRefreshToken));

		refreshTokenRepository.save(refreshToken);
	}

	private void addRefreshTokenToCookie(HttpServletRequest request, HttpServletResponse response, String refreshToken) {
		int cookieMaxAge = (int)REFRESH_TOKEN_DURATION.toSeconds();

		CookieUtil.deleteCookie(request, response, REFRESH_TOKEN_COOKIE_NAME);
		CookieUtil.addCookie(response, REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieMaxAge);
	}

	private void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
		super.clearAuthenticationAttributes(request);
		authorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
	}

	private String getTargetUrl(String token) {
		return UriComponentsBuilder.fromUriString(REDIRECT_PATH)
			.queryParam("token", token)
			.build()
			.toUriString();
	}
}
