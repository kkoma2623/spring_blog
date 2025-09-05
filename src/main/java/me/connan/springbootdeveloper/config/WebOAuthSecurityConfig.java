package me.connan.springbootdeveloper.config;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.*;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.config.jwt.TokenProvider;
import me.connan.springbootdeveloper.config.oauth.OAuth2AuthorizationRequestBasedOnCookieRepository;
import me.connan.springbootdeveloper.config.oauth.OAuth2SuccessHandler;
import me.connan.springbootdeveloper.config.oauth.OAuth2UserCustomService;

@RequiredArgsConstructor
@Configuration
public class WebOAuthSecurityConfig {

	private final OAuth2UserCustomService oAuth2UserCustomService;
	private final TokenProvider tokenProvider;
	private final OAuth2SuccessHandler oAuth2SuccessHandler; // 자동 주입됨
	private final OAuth2AuthorizationRequestBasedOnCookieRepository authRequestRepository; // OK

	@Bean
	public WebSecurityCustomizer configure() { // 스프링 시큐리티 기능 비활성화
		return (web) -> web.ignoring()
			.requestMatchers(toH2Console())
			.requestMatchers(
				new AntPathRequestMatcher("/img/**"),
				new AntPathRequestMatcher("/css/**"),
				new AntPathRequestMatcher("/js/**")
			);
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.cors(Customizer.withDefaults())
			.csrf(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.logout(AbstractHttpConfigurer::disable)
			.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
			.authorizeRequests(auth -> auth
				.requestMatchers(new AntPathRequestMatcher("/api/token")).permitAll()
				.requestMatchers(new AntPathRequestMatcher("/api/**")).authenticated()
				.anyRequest().permitAll())
			.oauth2Login(oauth2 -> oauth2
				.loginPage("/login")
				.authorizationEndpoint(
					authorizationEndpoint -> authorizationEndpoint.authorizationRequestRepository(authRequestRepository))
				.userInfoEndpoint(userInfoEndpoint -> userInfoEndpoint.userService(oAuth2UserCustomService))
				.successHandler(oAuth2SuccessHandler)
			)
			.exceptionHandling(exceptionHandling -> exceptionHandling
				.defaultAuthenticationEntryPointFor(
					new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
					new AntPathRequestMatcher("/api/**")
				))
			.build();
	}

	@Bean
	public TokenAuthenticationFilter tokenAuthenticationFilter() {
		return new TokenAuthenticationFilter(tokenProvider);
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws
		Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:3000"));  // 리액트 주소 넣기
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		// 명시적으로 Authorization 등 필요한 헤더들을 허용
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true); // 쿠키, 인증정보 허용

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}
