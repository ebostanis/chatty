package org.chattyproject.controllers;

import org.chattyproject.dtos.CreateMessageRequest;
import org.chattyproject.dtos.MessageResponse;
import org.chattyproject.models.Message;
import org.chattyproject.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats/{chatId}/messages")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<List<MessageResponse>> createMessage(@PathVariable Long chatId,
                                                         @RequestBody CreateMessageRequest request) {

        List<Message> messages = messageService.createUserMessage(chatId, request.content());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messages.stream()
                        .map(m -> new MessageResponse(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
                        .toList()
                );

    }

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(
                messageService.getMessagesForChat(chatId).stream()
                        .map(m -> new MessageResponse(m.getId(), m.getRole(), m.getContent(), m.getCreatedAt()))
                        .toList()
        );
    }

}
