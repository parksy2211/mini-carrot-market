package com.tdt.carrot.auth.service;

import com.tdt.carrot.auth.dto.LoginRequest;
import com.tdt.carrot.auth.dto.LoginResponse;
import com.tdt.carrot.auth.dto.SignupRequest;
import com.tdt.carrot.auth.jwt.JwtProvider;
import com.tdt.carrot.user.domain.User;
import com.tdt.carrot.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // 회원가입
    public void signup(SignupRequest request) {
        // 1) 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2) 닉네임 중복 체크
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        // 3) 비밀번호 해시
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 4) 회원가입용 생성자로 User 생성 후 저장 (엔티티 생성)
        User user = new User(
                request.getName(),
                request.getNickname(),
                request.getPhone(),
                request.getEmail(),
                hashedPassword
        );

        // 저장
        userRepository.save(user);
    }

    // 로그인
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 틀렸습니다."));

        // 해시 비교 (평문 비교 절대 x)
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matches) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 틀렸습니다.");
        }

        String token = jwtProvider.createAccessToken(user.getId(), user.getEmail());
        return new LoginResponse(token);
    }

}