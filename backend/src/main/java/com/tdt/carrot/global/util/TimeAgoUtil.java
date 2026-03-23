package com.tdt.carrot.global.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeAgoUtil {

    private TimeAgoUtil() {}

    public static String from(LocalDateTime createdAt) {
        LocalDateTime now = LocalDateTime.now();

        long minutes = Duration.between(createdAt, now).toMinutes();
        if (minutes < 1) return "방금 전";
        if (minutes < 60) return minutes + "분 전";

        long hours = Duration.between(createdAt, now).toHours();
        if (hours < 24) return hours + "시간 전";

        long days = Duration.between(createdAt, now).toDays();
        return days + "일 전";
    }
}
