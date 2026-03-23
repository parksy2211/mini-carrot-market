package com.tdt.carrot.item.api.controller;

import com.tdt.carrot.auth.jwt.AuthUser;
import com.tdt.carrot.item.api.dto.ItemCardResponse;
import com.tdt.carrot.item.api.dto.ItemCreateRequest;
import com.tdt.carrot.item.api.dto.ItemDetailResponse;
import com.tdt.carrot.item.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // 상품 등록
    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody ItemCreateRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AuthUser user = (AuthUser) authentication.getPrincipal(); // 필터에서 넣어준 principal

        Long itemId = itemService.createItem(user.getUserId(), req);

        return ResponseEntity.status(201).body(java.util.Map.of("itemId", itemId));
    }

    // 메인 페이지 카드 리스트
    // GET /items?page=0&size=10
    @GetMapping
    public Page<ItemCardResponse> getItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return itemService.getItemCards(page, size);
    }

    @GetMapping("/{itemId}")
    public ItemDetailResponse getItemDetail(@PathVariable Long itemId) {
        return itemService.getItemDetail(itemId);
    }
}