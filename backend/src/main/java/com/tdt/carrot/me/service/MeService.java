package com.tdt.carrot.me.service;

import com.tdt.carrot.global.util.TimeAgoUtil;
import com.tdt.carrot.item.api.dto.ItemCardResponse;
import com.tdt.carrot.item.repository.ItemRepository;
import com.tdt.carrot.me.api.dto.MeUpdateRequest;
import com.tdt.carrot.purchase.repository.PurchaseRepository;
import com.tdt.carrot.shop.domain.Shop;
import com.tdt.carrot.shop.repository.ShopRepository;
import com.tdt.carrot.user.domain.User;
import com.tdt.carrot.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@Transactional
public class MeService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ItemRepository itemRepository;
    private final PurchaseRepository purchaseRepository;

    public MeService(UserRepository userRepository, ShopRepository shopRepository, ItemRepository itemRepository, PurchaseRepository purchaseRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.itemRepository = itemRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public void updateMe(Long userId, MeUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found. id=" + userId));

        Shop shop = shopRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found. id=" + userId));

        // 1) 닉네임이 null/빈문자 아니면 user 닉네임 변경
        if (req.getNickname() != null && !req.getNickname().isBlank()) {
            user.changeNickname(req.getNickname());
        }

        // 2) intro가 null이 아니면 shop 소개 변경
        if (req.getIntro() != null) {
            shop.changeIntro(req.getIntro());
        }

        // 3) avatarUrl이 null이 아니면 shop 아바타 변경
        if (req.getAvatarUrl() != null) {
            shop.changeAvatarUrl(req.getAvatarUrl());
        }

        // save 호출 안 해도 됨: @Transactional + JPA 변경감지로 자동 반영
    }

    // 내 판매 목록
    @Transactional(readOnly = true)
    public Page<ItemCardResponse> getMySellItems(Long userId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return itemRepository.findBySellerId(userId, pageable).map(item -> {
            String timeAgo = TimeAgoUtil.from(item.getCreatedAt());
            return new ItemCardResponse(
                    item.getId(),
                    item.getTitle(),
                    item.getPrice(),
                    item.getRegion(),
                    timeAgo
            );
        });
    }

    // 내 구매 목록
    @Transactional(readOnly = true)
    public Page<ItemCardResponse> getMyBuyItems(Long userId, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return purchaseRepository.findByBuyerId(userId, pageable)
                .map(purchase -> {
                    var item = purchase.getItem();
                    String timeAgo = TimeAgoUtil.from(item.getCreatedAt());

                    return new ItemCardResponse(
                            item.getId(),
                            item.getTitle(),
                            item.getPrice(),
                            item.getRegion(),
                            timeAgo
                    );
                });
    }
}
