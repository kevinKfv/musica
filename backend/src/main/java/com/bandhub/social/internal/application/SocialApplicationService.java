package com.bandhub.social.internal.application;

import com.bandhub.social.internal.domain.*;
import com.bandhub.social.internal.web.dto.CreatePostRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialApplicationService {

    private final SocialRepository socialRepository;
    private final CommentRepository commentRepository;
    private final FollowRelationRepository followRelationRepository;

    @Transactional
    public Post createPost(String authorEmail, CreatePostRequest request) {
        Post post = new Post();
        post.setAuthorEmail(authorEmail);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setLinkUrl(request.getLinkUrl());
        post.setCategory(request.getCategory() != null ? request.getCategory() : "General");

        if (request.getPostType() != null) {
            try {
                post.setPostType(Post.PostType.valueOf(request.getPostType()));
            } catch (IllegalArgumentException e) {
                post.setPostType(Post.PostType.DISCUSSION);
            }
        }

        if (request.getMedia() != null) {
            for (var m : request.getMedia()) {
                PostMedia media = new PostMedia();
                media.setMediaUrl(m.getMediaUrl());
                media.setMediaType(PostMedia.MediaType.valueOf(m.getMediaType()));
                post.addMedia(media);
            }
        }

        return socialRepository.save(post);
    }

    @Transactional
    public void addComment(UUID postId, String authorEmail, String content) {
        Post post = socialRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Comment comment = new Comment();
        comment.setAuthorEmail(authorEmail);
        comment.setContent(content);
        post.addComment(comment);

        socialRepository.save(post);
    }

    @Transactional
    public void upvote(UUID postId) {
        Post post = socialRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setUpvotes(post.getUpvotes() + 1);
        socialRepository.save(post);
    }

    @Transactional
    public void downvote(UUID postId) {
        Post post = socialRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setDownvotes(post.getDownvotes() + 1);
        socialRepository.save(post);
    }

    @Transactional
    public void follow(UUID followerId, UUID targetId) {
        if (followerId.equals(targetId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        followRelationRepository.findByFollowerIdAndTargetId(followerId, targetId)
            .ifPresentOrElse(
                followRelationRepository::delete,
                () -> {
                    FollowRelation relation = new FollowRelation();
                    relation.setFollowerId(followerId);
                    relation.setTargetId(targetId);
                    followRelationRepository.save(relation);
                }
            );
    }
}
