package com.tdt.carrot.item.service;

import com.tdt.carrot.global.util.TimeAgoUtil;
import com.tdt.carrot.item.api.dto.ItemCardResponse;
import com.tdt.carrot.item.api.dto.ItemCreateRequest;
import com.tdt.carrot.item.api.dto.ItemDetailResponse;
import com.tdt.carrot.item.domain.Item;
import com.tdt.carrot.item.repository.ItemRepository;
import com.tdt.carrot.user.domain.User;
import com.tdt.carrot.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@Transactional(readOnly = true)
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public ItemService(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    // 상품 등록
    @Transactional
    public Long createItem(Long sellerId, ItemCreateRequest req) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new EntityNotFoundException(("User not found. id=" + sellerId)));

        Item item = new Item(req.getTitle(), req.getPrice(), req.getRegion(), req.getDescription(), seller);
        Item saved = itemRepository.save(item);
        return saved.getId();
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public ItemDetailResponse getItemDetail(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found"));

        String timeAgo = TimeAgoUtil.from(item.getCreatedAt());

        return new ItemDetailResponse(
                item.getId(),
                item.getTitle(),
                item.getPrice(),
                item.getRegion(),
                timeAgo,
                item.getSeller().getName(),
                item.getDescription()
        );
    }

    // 목록 조회
    @Transactional(readOnly = true)
    public Page<ItemCardResponse> getItemCards(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        return itemRepository.findAll(pageable).map(item -> {
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
