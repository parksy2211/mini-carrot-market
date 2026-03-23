package com.tdt.carrot.me.api.controller;

import com.tdt.carrot.auth.jwt.AuthUser;
import com.tdt.carrot.item.api.dto.ItemCardResponse;
import com.tdt.carrot.me.api.dto.MeResponse;
import com.tdt.carrot.me.api.dto.MeUpdateRequest;
import com.tdt.carrot.me.service.MeService;
import com.tdt.carrot.shop.domain.Shop;
import com.tdt.carrot.shop.repository.ShopRepository;
import com.tdt.carrot.user.domain.User;
import com.tdt.carrot.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/me")
public class MeController {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final MeService meService;

    public MeController(UserRepository userRepository, ShopRepository shopRepository, MeService meService) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.meService = meService;
    }

    @GetMapping
    public MeResponse getMe(Authentication authentication) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found. id=" + userId));

        Shop shop = shopRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found. userId=" + userId));

        return new MeResponse(
                user.getId(),
                user.getNickname(),
                shop.getIntro(),
                shop.getAvatarUrl(),
                shop.getFollowerCount(),
                shop.getFollowingCount()
        );
    }

    @PatchMapping
    public void updateMe(Authentication authentication, @RequestBody MeUpdateRequest req) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        meService.updateMe(userId, req);
    }

    @GetMapping("/items/sell")
    public Page<ItemCardResponse> getMySellItems(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        return meService.getMySellItems(userId, page,size);
    }

    @GetMapping("/items/buy")
    public Page<ItemCardResponse> getMyBuyItems(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        AuthUser authUser = (AuthUser) authentication.getPrincipal();
        Long userId = authUser.getUserId();

        return meService.getMyBuyItems(userId, page, size);
    }
}