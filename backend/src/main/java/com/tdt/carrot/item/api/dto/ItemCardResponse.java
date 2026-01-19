package com.tdt.carrot.item.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ItemCardResponse {
    private Long itemId;
    private String title;
    private Integer price;
    private String sellerName;
}
