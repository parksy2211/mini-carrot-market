package com.tdt.carrot.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final Key key;
    private final long accessExpMs;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-exp-seconds}") long accessExpSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpMs = accessExpSeconds * 1000L;
    }

    public String createAccessToken(Long userId, String email) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessExpMs);

        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    // 1) 토큰이 유효한지 검사 (맞으면 true, 틀리면 false)
    public boolean validate(String token) {
        try {
            parseClaims(token); // 여기서 서명/만료 체크가 같이 됨
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 2) 토큰에서 userId 꺼내기
    public Long getUserId(String token) {
        Claims claims = parseClaims(token);
        return Long.parseLong(claims.getSubject());
    }

    // 3) 토큰에서 email 꺼내기
    public String getEmail(String token) {
        Claims claims = parseClaims(token);
        return claims.get("email", String.class);
    }

    // (내부에서만 쓰는 공통 함수) 토큰 해석하기
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
