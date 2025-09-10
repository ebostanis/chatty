package org.chattyproject.dtos;

import jakarta.validation.constraints.NotBlank;

public record LogInRequest(
        @NotBlank String email,
        @NotBlank String password
) {}
