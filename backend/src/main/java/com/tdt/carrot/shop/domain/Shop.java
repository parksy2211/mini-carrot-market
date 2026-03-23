package com.tdt.carrot.shop.domain;

import com.tdt.carrot.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "shops")
public class Shop {

    @Id
    private Long id; // userId를 그대로 PK로 사용

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId // User의 PK를 Shop PK로 매핑(공유 PK)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 200)
    private String intro;

    @Column(length = 500)
    private String avatarUrl;

    @Column(nullable = false)
    private int followerCount;

    @Column(nullable = false)
    private int followingCount;

    public Shop(User user) {
        this.user = user;
        this.followerCount = 0;
        this.followingCount = 0;
    }

    public void changeIntro(String intro) {
        this.intro = intro;
    }

    public void changeAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
