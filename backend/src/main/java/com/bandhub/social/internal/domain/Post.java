package com.bandhub.social.internal.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "posts", schema = "schema_social")
@Getter
@Setter
@NoArgsConstructor
public class Post {

    public enum PostType { DISCUSSION, MUSIC, QUESTION, IMAGE }

    @Id
    @GeneratedValue
    private UUID id;

    /** Email del autor (no UUID — evita dependencia entre módulos) */
    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    @Column(name = "title")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "category")
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "post_type")
    private PostType postType = PostType.DISCUSSION;

    @Column(name = "upvotes")
    private int upvotes = 0;

    @Column(name = "downvotes")
    private int downvotes = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostMedia> media = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    public int getScore() {
        return upvotes - downvotes;
    }

    public void addMedia(PostMedia item) {
        media.add(item);
        item.setPost(this);
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }
}
