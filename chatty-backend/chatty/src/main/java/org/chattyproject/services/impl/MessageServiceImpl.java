package org.chattyproject.services.impl;

import org.chattyproject.models.Chat;
import org.chattyproject.models.Message;
import org.chattyproject.repositories.MessageRepository;
import org.chattyproject.services.ChatService;
import org.chattyproject.services.LlmClient;
import org.chattyproject.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatService chatService;
    private final LlmClient llmClient;

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository, ChatService chatService, LlmClient llmClient) {
        this.messageRepository = messageRepository;
        this.chatService = chatService;
        this.llmClient = llmClient;
    }

    @Override
    public List<Message> createUserMessage(Long chatId, String content) {
        Chat chat = chatService.getChatById(chatId);

        Message userMessage = new Message();
        userMessage.setChat(chat);
        userMessage.setRole("user");
        userMessage.setContent(content);
        messageRepository.save(userMessage);

        String reply = llmClient.generateReply(content);

        Message llmMessage = new Message();
        llmMessage.setChat(chat);
        llmMessage.setRole("assistant");
        llmMessage.setContent(content);
        messageRepository.save(llmMessage);

        return List.of(userMessage, llmMessage);
    }


    @Override
    public List<Message> getMessagesForChat(Long chatId) {
        Chat chat = chatService.getChatById(chatId);
        return messageRepository.findByChatId(chat.getId());
    }

}
