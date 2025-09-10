package org.chattyproject.dtos;

public record UserResponse(
        Long id,
        String email,
        String subscription
) {}
