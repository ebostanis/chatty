package org.chattyproject.services.impl;

import org.chattyproject.dtos.UpdateUserRequest;
import org.chattyproject.models.User;
import org.chattyproject.repositories.UserRepository;
import org.chattyproject.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder =  new BCryptPasswordEncoder();

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getCurrentUser() {

        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    @Override
    public User updateCurrentUser(UpdateUserRequest request) {

        User user = getCurrentUser();

        if (!bCryptPasswordEncoder.matches(request.password(),  user.getPassword())) {
            user.setPasswordHash(bCryptPasswordEncoder.encode(request.password()));
            user.setSubscription(request.subscription());
            return userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

    }

    @Override
    public void deleteCurrentUser() {
        User user = getCurrentUser();
        userRepository.delete(user);
    }
}
