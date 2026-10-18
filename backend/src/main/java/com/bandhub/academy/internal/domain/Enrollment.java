package com.bandhub.academy.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "enrollments", schema = "schema_academy")
public class Enrollment {

    @Id
    private UUID id;
    private UUID courseId;
    private UUID studentId;
    private ZonedDateTime enrolledAt;

    protected Enrollment() {}

    public Enrollment(UUID id, UUID courseId, UUID studentId) {
        this.id = id;
        this.courseId = courseId;
        this.studentId = studentId;
        this.enrolledAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getCourseId() { return courseId; }
    public UUID getStudentId() { return studentId; }
    public ZonedDateTime getEnrolledAt() { return enrolledAt; }
}
