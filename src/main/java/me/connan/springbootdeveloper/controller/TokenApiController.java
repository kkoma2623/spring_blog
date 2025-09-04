package me.connan.springbootdeveloper.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.dto.CreateAccessTokenRequest;
import me.connan.springbootdeveloper.dto.CreateAccessTokenResponse;
import me.connan.springbootdeveloper.service.TokenService;

@RequiredArgsConstructor
@RestController
public class TokenApiController {
	private final TokenService tokenService;

	@PostMapping("/api/token")
	public ResponseEntity<CreateAccessTokenResponse> createNewAccessToken(@RequestBody CreateAccessTokenRequest request) {
		String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(new CreateAccessTokenResponse(newAccessToken));
	}
}
