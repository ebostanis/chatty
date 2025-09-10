package org.chattyproject.services;

import org.chattyproject.models.Message;

import java.util.List;

public interface MessageService {

    List<Message> createUserMessage(Long chatId, String content);

    List<Message> getMessagesForChat(Long chatId);
}
