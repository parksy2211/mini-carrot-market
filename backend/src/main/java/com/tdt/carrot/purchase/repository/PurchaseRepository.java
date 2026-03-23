package com.tdt.carrot.purchase.repository;

import com.tdt.carrot.purchase.domain.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    // 내 구매 목록
    Page<Purchase> findByBuyerId(Long buyerId, Pageable pageable);

    // 내 판매 완료 목록 (item.seller 기준)
    Page<Purchase> findByItemSellerId(Long sellerId, Pageable pageable);
}

