package com.bandhub.chat.internal.infrastructure;

import com.bandhub.chat.internal.domain.ConversationParticipant;
import com.bandhub.chat.internal.domain.ConversationParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, ConversationParticipantId> {
    List<ConversationParticipant> findByUserId(UUID userId);
}
