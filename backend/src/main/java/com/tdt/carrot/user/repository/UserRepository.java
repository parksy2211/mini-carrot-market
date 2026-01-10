package com.tdt.carrot.user.repository;

import com.tdt.carrot.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 회원가입 중복 체크용
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);

    // 로그인용 (email로 유저 찾기)
    Optional<User> findByEmail(String email);
}