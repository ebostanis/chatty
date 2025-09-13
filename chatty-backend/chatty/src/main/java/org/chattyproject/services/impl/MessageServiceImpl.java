package org.chattyproject.services.impl;

import org.chattyproject.models.Chat;
import org.chattyproject.models.Message;
import org.chattyproject.repositories.MessageRepository;
import org.chattyproject.services.ChatService;
import org.chattyproject.services.LlmClient;
import org.chattyproject.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ChatService chatService;
    private final LlmClient llmClient;
    Instant instant = Instant.now();

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
        userMessage.setCreatedAt(LocalDateTime.ofInstant(instant, ZoneOffset.UTC));
        messageRepository.save(userMessage);

        List<Message> history = messageRepository.findByChatId(chatId);

        List<Map<String, String>> messages = history.stream()
                .map(m -> Map.of("role", m.getRole(), "content", m.getContent()))
                .collect(Collectors.toList());

        messages.add(Map.of("role", "user", "content", content));

        String reply = llmClient.generateReply(messages);

        Message llmMessage = new Message();
        llmMessage.setChat(chat);
        llmMessage.setRole("assistant");
        llmMessage.setContent(reply);
        llmMessage.setCreatedAt(LocalDateTime.ofInstant(instant, ZoneOffset.UTC));
        messageRepository.save(llmMessage);

        return List.of(userMessage, llmMessage);
    }


    @Override
    public List<Message> getMessagesForChat(Long chatId) {
        Chat chat = chatService.getChatById(chatId);
        return messageRepository.findByChatId(chat.getId());
    }

}
