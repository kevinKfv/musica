package com.bandhub.chat.internal.infrastructure;

import com.bandhub.chat.internal.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
}
