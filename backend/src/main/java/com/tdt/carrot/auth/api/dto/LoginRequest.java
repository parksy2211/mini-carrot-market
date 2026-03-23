package com.tdt.carrot.auth.api.dto;

import lombok.Getter;

@Getter
public class LoginRequest {
    private String email;
    private String password;
}
