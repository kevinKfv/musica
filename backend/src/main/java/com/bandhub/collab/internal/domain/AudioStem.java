package com.bandhub.collab.internal.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "audio_stems", schema = "schema_collab")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AudioStem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private CollabProject project;

    @Column(name = "uploader_id", nullable = false)
    private UUID uploaderId;

    @Column(name = "file_url", nullable = false, length = 1024)
    private String fileUrl;

    @Column(nullable = false, length = 200)
    private String name;

    @OneToMany(mappedBy = "stem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimelineComment> comments = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    public void addComment(TimelineComment comment) {
        comments.add(comment);
        comment.setStem(this);
    }
}
