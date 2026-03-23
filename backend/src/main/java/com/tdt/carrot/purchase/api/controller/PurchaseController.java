package com.tdt.carrot.purchase.api.controller;

import com.tdt.carrot.auth.jwt.AuthUser;
import com.tdt.carrot.purchase.api.dto.PurchaseRequest;
import com.tdt.carrot.purchase.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping
    public ResponseEntity<?> purchase(@RequestBody @Valid PurchaseRequest request, Authentication authentication) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long buyerId = authUser.getUserId();
        Long purchaseId = purchaseService.purchase(buyerId, request.getItemId());

        return ResponseEntity.status(201).body(Map.of("purchaseId", purchaseId));
    }
}
