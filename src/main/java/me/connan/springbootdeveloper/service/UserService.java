package me.connan.springbootdeveloper.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import me.connan.springbootdeveloper.domain.User;
import me.connan.springbootdeveloper.dto.AddUserRequest;
import me.connan.springbootdeveloper.repository.UserRepository;

@RequiredArgsConstructor
@Service
public class UserService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	public Long save(AddUserRequest addUserRequest) {
		return userRepository.save(User.builder()
				.email(addUserRequest.getEmail())
				.password(bCryptPasswordEncoder.encode(addUserRequest.getPassword()))
				.build())
			.getId();
	}

	public User findById(Long id) {
		return userRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
	}
}
