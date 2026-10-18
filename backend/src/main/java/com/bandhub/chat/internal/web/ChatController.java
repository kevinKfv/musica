package com.bandhub.chat.internal.web;

import com.bandhub.chat.internal.application.ChatService;
import com.bandhub.chat.internal.domain.Conversation;
import com.bandhub.chat.internal.domain.Message;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createDirectConversation(@RequestBody CreateConversationRequest request) {
        Conversation conversation = chatService.createDirectConversation(request.user1(), request.user2());
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/users/{userId}/conversations")
    public ResponseEntity<List<Conversation>> getUserConversations(@PathVariable UUID userId) {
        return ResponseEntity.ok(chatService.getUserConversations(userId));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<Message>> getConversationHistory(@PathVariable UUID conversationId) {
        return ResponseEntity.ok(chatService.getConversationHistory(conversationId));
    }

    public record CreateConversationRequest(UUID user1, UUID user2) {}
}
