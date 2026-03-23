package com.tdt.carrot.purchase.domain;

import com.tdt.carrot.item.domain.Item;
import com.tdt.carrot.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 구매자 (User)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // 구매한 상품 (중고 1개 상품 = 1번만 판매)
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false, unique = true)
    private Item item;

    @Column(nullable = false)
    private LocalDateTime purchasedAt;

    public Purchase(User buyer, Item item) {
        this.buyer = buyer;
        this.item = item;
        this.purchasedAt = LocalDateTime.now();
    }
}
