package org.chattyproject.services;

import org.chattyproject.dtos.AuthResponse;
import org.chattyproject.dtos.LogInRequest;
import org.chattyproject.dtos.SignUpRequest;

public interface AuthService {

    AuthResponse signUp(SignUpRequest request);
    AuthResponse logIn(LogInRequest request);
}
