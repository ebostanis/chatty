package org.chattyproject.repositories;

import org.chattyproject.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    void deleteUserById(Long id);

    Optional<User> findByEmail(String email);
}
