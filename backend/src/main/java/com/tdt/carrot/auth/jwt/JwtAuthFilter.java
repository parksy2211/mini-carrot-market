package com.tdt.carrot.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    public JwtAuthFilter(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1) Authorization 헤더에서 "Bearer 토큰" 꺼내기
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        // 토큰이 아예 없으면 -> 그냥 다음으로 넘김
        // (대신, 나중에 Security 설정에서 "로그인 필요한 API"는 막히게 됨)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2) "Bearer" 뒤의 진짜 토큰만 분리
        String token = authHeader.substring(7);

        // 3) 유효성 검사 실패 -> 401로 거절
        if (!jwtProvider.validate(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write("{\"message\":\"Invalid or expired token\"}");
            return;
        }

        // 4) 유효하면 -> 토큰 안에서 userId/email 꺼내서 "로그인한 사용자"로 등록
        Long userId = jwtProvider.getUserId(token);
        String email = jwtProvider.getEmail(token);

        AuthUser authUser = new AuthUser(userId, email);

        // UsernamePasswordAuthenticationToken:
        // (principal=authUser, credentials=null, authorities=빈 리스트)
        var authentication = new UsernamePasswordAuthenticationToken(
                authUser,
                null,
                List.of() // 역할 분기 할 거면 ROLE_USER, ROLE_ADMIN 채워야 함
        );

        // 토큰 성공 시
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 5) 다음으로 넘김 (이제 컨트롤러로 들어갈 수 있음)
        filterChain.doFilter(request, response);

    }
}
