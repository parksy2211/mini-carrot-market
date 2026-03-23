package com.tdt.carrot.item.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemDetailResponse {

    // 목록이랑 동일
    private final Long itemId;
    private final String title;
    private final Integer price;
    private final String region;
    private final String timeAgo;

    // 디테일 추가
    private final String sellerName;
    private final String description;
}
