package com.tdt.carrot.item.service;

import com.tdt.carrot.item.api.dto.ItemCreateRequest;
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

        Item item = new Item(req.getTitle(), req.getPrice(), req.getDescription(), seller);
        Item saved = itemRepository.save(item);
        return saved.getId();
    }

    // 목록 조회 (무한 스크롤: page/size 방식)
    public Page<Item> getItems(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return itemRepository.findAll(pageable);
    }

    // 상세 조회
    public Item getItem(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found. id=" + itemId));
    }
}
