package org.chattyproject.controllers;

import org.chattyproject.dtos.UpdateUserRequest;
import org.chattyproject.dtos.UserResponse;
import org.chattyproject.models.User;
import org.chattyproject.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(toUserResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody UpdateUserRequest request) {
        User updated = userService.updateCurrentUser(request);
        return ResponseEntity.ok(toUserResponse(updated));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteCurrentUser() {
        userService.deleteCurrentUser();
        return ResponseEntity.noContent().build();
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getSubscription());
    }
}
