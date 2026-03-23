package com.tdt.carrot.auth.api.dto;

import lombok.Getter;

@Getter
public class SignupRequest {
    private String name;
    private String nickname;
    private String phone;
    private String email;
    private String password;
}
