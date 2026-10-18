package com.bandhub.social.internal.application;

import com.bandhub.social.internal.domain.Post;
import com.bandhub.social.internal.domain.Reaction;
import com.bandhub.social.internal.domain.ReactionRepository;
import com.bandhub.social.internal.domain.SocialRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class SocialRepositoryTest {

    @Autowired
    private SocialRepository socialRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Test
    void shouldEnforceUniqueReactionPerUserAndPost() {
        Post post = new Post();
        post.setAuthorId(UUID.randomUUID());
        post.setContent("Test Content");
        socialRepository.saveAndFlush(post);

        UUID userId = UUID.randomUUID();

        Reaction reaction1 = new Reaction();
        reaction1.setPost(post);
        reaction1.setUserId(userId);
        reaction1.setReactionType(Reaction.ReactionType.LIKE);
        reactionRepository.saveAndFlush(reaction1);

        Reaction reaction2 = new Reaction();
        reaction2.setPost(post);
        reaction2.setUserId(userId);
        reaction2.setReactionType(Reaction.ReactionType.LOVE);

        assertThrows(DataIntegrityViolationException.class, () -> {
            reactionRepository.saveAndFlush(reaction2);
        });
    }
}
