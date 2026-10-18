package com.bandhub.social.internal.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreatePostRequest {
    private String title;
    private String content;
    private String category;
    private String postType; // DISCUSSION | MUSIC | QUESTION | IMAGE
    private String linkUrl;
    private List<MediaAttachment> media;

    @Data
    public static class MediaAttachment {
        private String mediaUrl;
        private String mediaType;
    }
}
