package org.chattyproject.dtos;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        String role,
        String content,
        LocalDateTime createdAt
) {}
