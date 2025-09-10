package org.chattyproject.dtos;


import java.util.List;

public record ChatResponse(
        Long id,
        String title,
        Boolean archived,
        List<MessageResponse> messages
) {}
