package org.chattyproject.controllers;

import org.chattyproject.dtos.ChatResponse;
import org.chattyproject.dtos.CreateChatRequest;
import org.chattyproject.dtos.MessageResponse;
import org.chattyproject.models.Chat;
import org.chattyproject.services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> createChat(@RequestBody CreateChatRequest request) {
        Chat newChat = chatService.startNewChat(request.content());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toChatResponse(newChat));
    }

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getAllChats() {
        List<Chat> userChats = chatService.getAllChats();
        return ResponseEntity.ok(userChats.stream()
                .map(this::toChatResponse)
                .toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatResponse> getChat(@PathVariable Long id) {

        Chat chat = chatService.getChatById(id);
        ChatResponse chatResponse = toChatResponse(chat);
        return ResponseEntity.ok(chatResponse);
    }

    private ChatResponse toChatResponse(Chat chat) {
        return new ChatResponse(
                chat.getId(),
                chat.getTitle(),
                chat.getArchived(),
                chat.getMessages().stream()
                        .map(m -> new MessageResponse(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
                        .toList()
        );
    }
}
