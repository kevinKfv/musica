package com.bandhub.social.internal.web.dto;

import lombok.Data;
import lombok.Builder;
import java.util.UUID;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
public class PostDTO {
    private UUID id;
    private String authorEmail;
    private String title;
    private String content;
    private String linkUrl;
    private String category;
    private String postType;
    private int upvotes;
    private int downvotes;
    private int score;
    private int commentCount;
    private ZonedDateTime createdAt;
    private List<MediaDTO> media;
    private List<CommentDTO> comments;

    @Data
    @Builder
    public static class MediaDTO {
        private UUID id;
        private String mediaUrl;
        private String mediaType;
    }

    @Data
    @Builder
    public static class CommentDTO {
        private UUID id;
        private String authorEmail;
        private String content;
        private ZonedDateTime createdAt;
    }
}
