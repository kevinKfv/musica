package com.bandhub.chat.internal.domain;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "conversations", schema = "schema_chat")
public class Conversation {

    @Id
    private UUID id;
    private String type; // DIRECT or GROUP
    private String name;
    private ZonedDateTime createdAt;

    protected Conversation() {}

    public Conversation(UUID id, String type, String name) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public String getType() { return type; }
    public String getName() { return name; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
}
