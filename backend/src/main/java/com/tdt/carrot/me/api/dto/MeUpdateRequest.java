package com.tdt.carrot.me.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MeUpdateRequest {
    private String nickname;
    private String intro;
    private String avatarUrl;
}
