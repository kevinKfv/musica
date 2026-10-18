package com.bandhub.social.internal.web;

import com.bandhub.social.internal.application.FeedProjectionService;
import com.bandhub.social.internal.application.SocialApplicationService;
import com.bandhub.social.internal.domain.Post;
import com.bandhub.social.internal.web.dto.CreateCommentRequest;
import com.bandhub.social.internal.web.dto.CreatePostRequest;
import com.bandhub.social.internal.web.dto.PostDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialApplicationService socialApplicationService;
    private final FeedProjectionService feedProjectionService;

    @GetMapping("/feed")
    public ResponseEntity<List<PostDTO>> getFeed(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "new") String sort) {
        return ResponseEntity.ok(feedProjectionService.getFeed(category, sort));
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostDTO> getPost(@PathVariable UUID postId) {
        return ResponseEntity.ok(feedProjectionService.getPost(postId));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostDTO> createPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreatePostRequest request) {
        String email = userDetails.getUsername();
        Post post = socialApplicationService.createPost(email, request);
        return ResponseEntity.ok(feedProjectionService.getPost(post.getId()));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Void> addComment(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateCommentRequest request) {
        String email = userDetails.getUsername();
        socialApplicationService.addComment(postId, email, request.getContent());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/posts/{postId}/upvote")
    public ResponseEntity<Void> upvote(@PathVariable UUID postId) {
        socialApplicationService.upvote(postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/posts/{postId}/downvote")
    public ResponseEntity<Void> downvote(@PathVariable UUID postId) {
        socialApplicationService.downvote(postId);
        return ResponseEntity.ok().build();
    }
}
