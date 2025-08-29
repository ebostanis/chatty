package org.chattyproject.repositories;

import org.chattyproject.models.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {

}
