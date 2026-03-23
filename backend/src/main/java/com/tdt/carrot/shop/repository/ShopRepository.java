package com.tdt.carrot.shop.repository;

import com.tdt.carrot.shop.domain.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {

}
