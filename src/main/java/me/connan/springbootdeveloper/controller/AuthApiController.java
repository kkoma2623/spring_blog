package me.connan.springbootdeveloper.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.User;
import me.connan.springbootdeveloper.dto.LoginRequest;

@RestController
@RequiredArgsConstructor
public class AuthApiController {

	private final AuthenticationManager authenticationManager;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
		try {
			UsernamePasswordAuthenticationToken token =
				new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());

			Authentication auth = authenticationManager.authenticate(token);

			SecurityContextHolder.getContext().setAuthentication(auth);
			session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

			return ResponseEntity.ok().body("로그인 성공");
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
		}
	}

	@GetMapping("/api/user/me")
	public ResponseEntity<?> currentUser(@AuthenticationPrincipal User user) {
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body("로그인 안됨");
		}
		return ResponseEntity.ok()
			.body(user.getEmail());
	}
}

