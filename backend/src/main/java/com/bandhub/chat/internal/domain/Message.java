package com.bandhub.chat.internal.domain;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages", schema = "schema_chat")
public class Message {

    @Id
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private ZonedDateTime createdAt;

    protected Message() {}

    public Message(UUID id, UUID conversationId, UUID senderId, String content) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getConversationId() { return conversationId; }
    public UUID getSenderId() { return senderId; }
    public String getContent() { return content; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
}
