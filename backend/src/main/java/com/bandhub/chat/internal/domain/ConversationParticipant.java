package com.bandhub.chat.internal.domain;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "conversation_participants", schema = "schema_chat")
@IdClass(ConversationParticipantId.class)
public class ConversationParticipant {

    @Id
    private UUID conversationId;
    
    @Id
    private UUID userId;
    
    private ZonedDateTime joinedAt;

    protected ConversationParticipant() {}

    public ConversationParticipant(UUID conversationId, UUID userId) {
        this.conversationId = conversationId;
        this.userId = userId;
        this.joinedAt = ZonedDateTime.now();
    }

    public UUID getConversationId() { return conversationId; }
    public UUID getUserId() { return userId; }
    public ZonedDateTime getJoinedAt() { return joinedAt; }
}
