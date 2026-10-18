package com.bandhub.academy.internal.web;

import com.bandhub.academy.internal.application.AcademyService;
import com.bandhub.academy.internal.domain.Course;
import com.bandhub.academy.internal.domain.Enrollment;
import com.bandhub.academy.internal.domain.Lesson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academy")
public class AcademyController {

    private final AcademyService academyService;

    public AcademyController(AcademyService academyService) {
        this.academyService = academyService;
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody CreateCourseRequest request) {
        Course course = academyService.createCourse(
                request.teacherId(),
                request.title(),
                request.description(),
                request.price()
        );
        return ResponseEntity.ok(course);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses() {
        return ResponseEntity.ok(academyService.getAllCourses());
    }

    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Course> getCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(academyService.getCourse(courseId));
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<Lesson> addLesson(@PathVariable UUID courseId, @RequestBody CreateLessonRequest request) {
        Lesson lesson = academyService.addLesson(
                courseId,
                request.title(),
                request.content(),
                request.videoUrl(),
                request.orderIndex()
        );
        return ResponseEntity.ok(lesson);
    }

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable UUID courseId) {
        return ResponseEntity.ok(academyService.getCourseLessons(courseId));
    }

    @PostMapping("/courses/{courseId}/enroll")
    public ResponseEntity<Enrollment> enroll(@PathVariable UUID courseId, @RequestBody EnrollRequest request) {
        Enrollment enrollment = academyService.enrollStudent(courseId, request.studentId());
        return ResponseEntity.ok(enrollment);
    }

    @GetMapping("/courses/{courseId}/enrollment-status")
    public ResponseEntity<EnrollmentStatusResponse> getEnrollmentStatus(
            @PathVariable UUID courseId, 
            @RequestParam UUID studentId) {
        boolean isEnrolled = academyService.isEnrolled(courseId, studentId);
        return ResponseEntity.ok(new EnrollmentStatusResponse(isEnrolled));
    }

    public record CreateCourseRequest(UUID teacherId, String title, String description, BigDecimal price) {}
    public record CreateLessonRequest(String title, String content, String videoUrl, Integer orderIndex) {}
    public record EnrollRequest(UUID studentId) {}
    public record EnrollmentStatusResponse(boolean isEnrolled) {}
}
