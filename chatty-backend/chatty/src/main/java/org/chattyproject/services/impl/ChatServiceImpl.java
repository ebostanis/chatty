package org.chattyproject.services.impl;

import org.chattyproject.models.Chat;
import org.chattyproject.models.Message;
import org.chattyproject.models.User;
import org.chattyproject.repositories.ChatRepository;
import org.chattyproject.repositories.MessageRepository;
import org.chattyproject.services.ChatService;
import org.chattyproject.services.LlmClient;
import org.chattyproject.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserService userService;
    private final LlmClient llmClient;

    @Autowired
    public ChatServiceImpl(ChatRepository chatRepository, UserService userService, MessageRepository messageRepository, LlmClient llmClient) {
        this.chatRepository = chatRepository;
        this.userService = userService;
        this.messageRepository = messageRepository;
        this.llmClient = llmClient;
    }

    @Override
    public Chat startNewChat(String firstMessageContent) {
        User currentUser = userService.getCurrentUser();

        Chat chat = new Chat();
        chat.setUser(currentUser);
        chat.setArchived(false);
        chatRepository.save(chat);

        Message userMessage = new Message();
        userMessage.setChat(chat);
        userMessage.setRole("user");
        userMessage.setContent(firstMessageContent);
        messageRepository.save(userMessage);

        String title = llmClient.generateTitle(firstMessageContent);
        String llmReply = llmClient.generateReply(firstMessageContent);

        chat.setTitle(title);

        Message llmMessage = new Message();
        llmMessage.setChat(chat);
        llmMessage.setRole("assistant");
        llmMessage.setContent(llmReply);
        messageRepository.save(llmMessage);

        return  chatRepository.save(chat);
    }

    @Override
    public List<Chat> getAllChats() {
        User currentUser = userService.getCurrentUser();
        return chatRepository.findAllByUserId(currentUser.getId());
    }

    @Override
    public Chat getChatById(long id) {
        User currentUser = userService.getCurrentUser();

        Chat chat = chatRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!chat.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to access this resource");
        }

        return chat;
    }

    @Override
    public void archiveChat(Long chatId) {
        Chat chat = getChatById(chatId);
        chat.setArchived(true);
        chatRepository.save(chat);
    }

}
