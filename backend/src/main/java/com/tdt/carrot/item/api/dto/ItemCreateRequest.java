package com.tdt.carrot.item.api.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ItemCreateRequest {
    private String title;
    private Integer price;
    private String description;
}
