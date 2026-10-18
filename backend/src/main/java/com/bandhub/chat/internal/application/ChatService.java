package com.bandhub.chat.internal.application;

import com.bandhub.chat.internal.domain.Conversation;
import com.bandhub.chat.internal.domain.ConversationParticipant;
import com.bandhub.chat.internal.domain.Message;
import com.bandhub.chat.internal.infrastructure.ConversationParticipantRepository;
import com.bandhub.chat.internal.infrastructure.ConversationRepository;
import com.bandhub.chat.internal.infrastructure.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;

    public ChatService(ConversationRepository conversationRepository,
                       ConversationParticipantRepository participantRepository,
                       MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.messageRepository = messageRepository;
    }

    public Conversation createDirectConversation(UUID user1, UUID user2) {
        Conversation conversation = new Conversation(UUID.randomUUID(), "DIRECT", "Direct Chat");
        conversation = conversationRepository.save(conversation);

        participantRepository.save(new ConversationParticipant(conversation.getId(), user1));
        participantRepository.save(new ConversationParticipant(conversation.getId(), user2));

        return conversation;
    }

    public Message saveMessage(UUID conversationId, UUID senderId, String content) {
        // verify conversation exists
        conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        
        Message message = new Message(UUID.randomUUID(), conversationId, senderId, content);
        return messageRepository.save(message);
    }

    public List<Conversation> getUserConversations(UUID userId) {
        List<ConversationParticipant> participations = participantRepository.findByUserId(userId);
        return participations.stream()
                .map(p -> conversationRepository.findById(p.getConversationId()).orElse(null))
                .filter(c -> c != null)
                .collect(Collectors.toList());
    }

    public List<Message> getConversationHistory(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }
}
