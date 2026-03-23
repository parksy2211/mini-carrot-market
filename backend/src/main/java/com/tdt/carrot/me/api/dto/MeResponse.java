package com.tdt.carrot.me.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeResponse {
    private final Long userId;
    private final String nickname;
    private final String intro;
    private final String avatarUrl;
    private final int followerCount;
    private final int followingCount;
}
