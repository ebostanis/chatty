package org.chattyproject.services;

import org.chattyproject.models.Chat;

import java.util.List;
import java.util.Optional;

public interface ChatService {

    Chat startNewChat(String firstMessageContent);

    List<Chat> getAllChats();

    Chat getChatById(long id);

    void archiveChat(Long chatId);

}
