package com.bandhub.academy.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses", schema = "schema_academy")
public class Course {

    @Id
    private UUID id;
    private UUID teacherId;
    private String title;
    private String description;
    private BigDecimal price;
    private ZonedDateTime createdAt;

    protected Course() {}

    public Course(UUID id, UUID teacherId, String title, String description, BigDecimal price) {
        this.id = id;
        this.teacherId = teacherId;
        this.title = title;
        this.description = description;
        this.price = price;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getTeacherId() { return teacherId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
}
