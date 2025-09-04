package me.connan.springbootdeveloper.config;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.service.UserDetailService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

	private final UserDetailsService userService;

	// 스프링 시큐리티 기능 비활성화
	// h2 데이터를 확인하는데 사요하는 h2-console 하위 url 대상으로 쓰지 않겠다는 뜻
	// static 에 있는 정적 리소스는 스프링 시큐리티 기능을 쓰지 않겠다는 뜻
	@Bean
	public WebSecurityCustomizer configure() {
		return web -> web.ignoring()
			.requestMatchers(toH2Console())
			.requestMatchers(new AntPathRequestMatcher("/static/**"));
	}

	// 특정 HTTP 요청에 대한 웹 기반 보안 구성
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.authorizeHttpRequests(
				auth -> auth.requestMatchers(
						// 경로에 대한 엑세스 설정
						new AntPathRequestMatcher("/login"), new AntPathRequestMatcher("/signup"), new AntPathRequestMatcher("/user"))
					.permitAll() // 여기 위 세 경로로 요청이 오면 인증/인가 없이도 접근할 수 있게 함
					.anyRequest() // 위에서 설정한 url 이외의 요청에 대해서 설정
					.authenticated() // 별도의 인가는 빌요하지 않지만 인증이 성공된 상태여야 접근할 수 있음
			)
			.formLogin(formLogin -> formLogin // 폼 기반 로그인 설정
				.loginPage("/login") // 로그인 페이지 경로를 설정
				.defaultSuccessUrl("/articles") // 로그인 성공하면 이동할 경로
			)
			.logout(logout -> logout // 로그아웃 설정
				.logoutSuccessUrl("/login") // 로그아웃 완료되면 이동할 경로
				.invalidateHttpSession(true) // 로그아웃 이후에 세션을 전체 삭제할지 여부
			)
			.csrf(AbstractHttpConfigurer::disable) // CSRF 설정을 비활성화 하겠다. CSRF 공격 방지를 위해 해야하지만 실습을 위해 비활성화 함
			.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http, BCryptPasswordEncoder bCryptPasswordEncoder,
		UserDetailService userDetailService) throws Exception {
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
		authProvider.setUserDetailsService(userService); // 이때 설정하는 서비스 클래스는 무조건 UserDetailsService를 상속받아야 함
		authProvider.setPasswordEncoder(bCryptPasswordEncoder);

		return new ProviderManager(authProvider);
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
