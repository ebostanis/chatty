package org.chattyproject.services.impl;

import org.chattyproject.dtos.AuthResponse;
import org.chattyproject.dtos.LogInRequest;
import org.chattyproject.dtos.SignUpRequest;
import org.chattyproject.jwt.JwtUtil;
import org.chattyproject.models.User;
import org.chattyproject.repositories.UserRepository;
import org.chattyproject.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder =  new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse signUp(SignUpRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists!");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(bCryptPasswordEncoder.encode(request.password()));
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generateToken(user.getUsername()));
    }

    @Override
    public AuthResponse logIn(LogInRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email!"));

        if (!bCryptPasswordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid password!");
        }

        return new AuthResponse(jwtUtil.generateToken(user.getUsername()));
    }

}
