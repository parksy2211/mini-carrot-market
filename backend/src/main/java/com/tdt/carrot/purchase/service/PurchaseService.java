package com.tdt.carrot.purchase.service;

import com.tdt.carrot.item.domain.Item;
import com.tdt.carrot.item.repository.ItemRepository;
import com.tdt.carrot.purchase.domain.Purchase;
import com.tdt.carrot.purchase.repository.PurchaseRepository;
import com.tdt.carrot.user.domain.User;
import com.tdt.carrot.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public PurchaseService(PurchaseRepository purchaseRepository, UserRepository userRepository, ItemRepository itemRepository) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public Long purchase(Long buyerId, Long itemId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new EntityNotFoundException("User not found. id=" + buyerId));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found. id=" + itemId));

        // 내가 내 물건을 사는 건 막기
        if (item.getSeller().getId().equals(buyerId)) {
            throw new IllegalArgumentException("본인 상품은 구매할 수 없습니다.");
        }

        // Purchase는 item_id가 unique라서 같은 item을 두 번 구매하려 하면 DB에서 막힘
        Purchase purchase = new Purchase(buyer, item);
        Purchase saved = purchaseRepository.save(purchase);
        return saved.getId();
    }
}
