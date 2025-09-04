package me.connan.springbootdeveloper.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.dto.AddUserRequest;
import me.connan.springbootdeveloper.service.UserService;

@RequiredArgsConstructor
@RestController
public class UserApiController {

	private final UserService userService;

	@PostMapping("/user")
	public ResponseEntity<AddUserRequest> signup(@RequestBody AddUserRequest addUserRequest) {
		userService.save(addUserRequest);
		return ResponseEntity.ok()
			.body(addUserRequest);
	}

	@GetMapping("/logout")
	public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
		new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext()
			.getAuthentication());
		return ResponseEntity.ok()
			.body("logged out successfully");
	}
}
