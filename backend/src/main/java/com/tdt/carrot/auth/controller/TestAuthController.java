package com.tdt.carrot.auth.controller;

import com.tdt.carrot.auth.jwt.AuthUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAuthController {

    // 토큰 없어도 되는 거
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }

    // 토큰 있어야 하는 거
    @GetMapping("/secure/ping")
    public ResponseEntity<?> securePing() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = (auth == null) ? null : auth.getPrincipal();

        if (principal instanceof AuthUser user) {
            return ResponseEntity.ok(user);
        }

        // 인증 안 잡힐 경우 확인용
        return ResponseEntity.ok("authenticated but principal is not AuthUser: " + principal);
    }
}
