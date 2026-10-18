package com.bandhub.social.internal.application;

import com.bandhub.social.internal.domain.*;
import com.bandhub.social.internal.web.dto.CreatePostRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SocialApplicationServiceTest {

    @Mock
    private SocialRepository socialRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private ReactionRepository reactionRepository;
    @Mock
    private FollowRelationRepository followRelationRepository;

    @InjectMocks
    private SocialApplicationService socialApplicationService;

    private UUID authorId;
    private UUID postId;
    private Post post;

    @BeforeEach
    void setUp() {
        authorId = UUID.randomUUID();
        postId = UUID.randomUUID();
        post = new Post();
        post.setId(postId);
        post.setAuthorId(authorId);
        post.setContent("Test Content");
    }

    @Test
    void createPost_success() {
        CreatePostRequest request = new CreatePostRequest();
        request.setContent("Hello World");
        
        when(socialRepository.save(any(Post.class))).thenAnswer(i -> {
            Post savedPost = (Post) i.getArguments()[0];
            savedPost.setId(UUID.randomUUID());
            return savedPost;
        });

        Post result = socialApplicationService.createPost(authorId, request);

        assertNotNull(result);
        assertEquals("Hello World", result.getContent());
        assertEquals(authorId, result.getAuthorId());
        verify(socialRepository, times(1)).save(any(Post.class));
    }

    @Test
    void addComment_success() {
        when(socialRepository.findById(postId)).thenReturn(Optional.of(post));
        
        socialApplicationService.addComment(postId, authorId, "Nice post!");

        verify(socialRepository, times(1)).save(post);
        assertEquals(1, post.getComments().size());
        assertEquals("Nice post!", post.getComments().get(0).getContent());
    }

    @Test
    void reactToPost_newReaction() {
        UUID userId = UUID.randomUUID();
        when(socialRepository.findById(postId)).thenReturn(Optional.of(post));
        when(reactionRepository.findByPostIdAndUserId(postId, userId)).thenReturn(Optional.empty());

        socialApplicationService.reactToPost(postId, userId, "LIKE");

        verify(socialRepository, times(1)).save(post);
        assertEquals(1, post.getReactions().size());
        assertEquals(Reaction.ReactionType.LIKE, post.getReactions().get(0).getReactionType());
    }
}
