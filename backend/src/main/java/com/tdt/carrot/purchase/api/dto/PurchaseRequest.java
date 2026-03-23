package com.tdt.carrot.purchase.api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PurchaseRequest {

    @NotNull
    private Long itemId;
}
