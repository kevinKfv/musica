package com.bandhub.social.internal.application;

import com.bandhub.social.internal.domain.Post;
import com.bandhub.social.internal.domain.SocialRepository;
import com.bandhub.social.internal.web.dto.PostDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedProjectionService {

    private final SocialRepository socialRepository;

    @Transactional(readOnly = true)
    public List<PostDTO> getFeed(String category, String sort) {
        List<Post> posts;

        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("all");
        boolean sortByTop = "top".equalsIgnoreCase(sort);

        if (hasCategory && sortByTop) {
            posts = socialRepository.findByCategoryOrderByUpvotesDescCreatedAtDesc(category);
        } else if (hasCategory) {
            posts = socialRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else if (sortByTop) {
            posts = socialRepository.findAllByOrderByUpvotesDescCreatedAtDesc();
        } else {
            // "new" or "hot" both use createdAt for now (hot algo could be added later)
            posts = socialRepository.findAllByOrderByCreatedAtDesc();
        }

        return posts.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostDTO getPost(UUID postId) {
        Post post = socialRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found: " + postId));
        return mapToDTO(post);
    }

    private PostDTO mapToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .authorEmail(post.getAuthorEmail())
                .title(post.getTitle())
                .content(post.getContent())
                .linkUrl(post.getLinkUrl())
                .category(post.getCategory())
                .postType(post.getPostType() != null ? post.getPostType().name() : "DISCUSSION")
                .upvotes(post.getUpvotes())
                .downvotes(post.getDownvotes())
                .score(post.getScore())
                .createdAt(post.getCreatedAt())
                .commentCount(post.getComments().size())
                .media(post.getMedia().stream().map(m -> PostDTO.MediaDTO.builder()
                        .id(m.getId())
                        .mediaUrl(m.getMediaUrl())
                        .mediaType(m.getMediaType().name())
                        .build()).collect(Collectors.toList()))
                .comments(post.getComments().stream().map(c -> PostDTO.CommentDTO.builder()
                        .id(c.getId())
                        .authorEmail(c.getAuthorEmail())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
