package com.bandhub.academy.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "lessons", schema = "schema_academy")
public class Lesson {

    @Id
    private UUID id;
    private UUID courseId;
    private String title;
    private String content;
    private String videoUrl;
    private Integer orderIndex;

    protected Lesson() {}

    public Lesson(UUID id, UUID courseId, String title, String content, String videoUrl, Integer orderIndex) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.content = content;
        this.videoUrl = videoUrl;
        this.orderIndex = orderIndex;
    }

    public UUID getId() { return id; }
    public UUID getCourseId() { return courseId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getVideoUrl() { return videoUrl; }
    public Integer getOrderIndex() { return orderIndex; }
}
