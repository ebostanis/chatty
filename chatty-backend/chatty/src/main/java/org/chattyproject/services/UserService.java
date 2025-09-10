package org.chattyproject.services;


import org.chattyproject.dtos.UpdateUserRequest;
import org.chattyproject.models.User;

public interface UserService {

    User getCurrentUser();

    void deleteCurrentUser();

    User updateCurrentUser(UpdateUserRequest request);

}
