package com.bandhub.chat.internal.web;

import com.bandhub.chat.internal.application.ChatService;
import com.bandhub.chat.internal.domain.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat/{conversationId}/send")
    public void sendMessage(@DestinationVariable UUID conversationId, @Payload ChatMessagePayload payload) {
        // Save message to DB
        Message savedMessage = chatService.saveMessage(conversationId, payload.senderId(), payload.content());
        
        // Broadcast to all subscribers of this conversation
        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, savedMessage);
    }

    public record ChatMessagePayload(UUID senderId, String content) {}
}
