package com.tdt.carrot.item.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemDetailResponse {
    private final Long itemId;
    private final String title;
    private final Integer price;
    private final String sellerName;
    private final String description;
}
