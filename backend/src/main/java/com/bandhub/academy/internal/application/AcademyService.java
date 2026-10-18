package com.bandhub.academy.internal.application;

import com.bandhub.academy.internal.domain.Course;
import com.bandhub.academy.internal.domain.Enrollment;
import com.bandhub.academy.internal.domain.Lesson;
import com.bandhub.academy.internal.infrastructure.CourseRepository;
import com.bandhub.academy.internal.infrastructure.EnrollmentRepository;
import com.bandhub.academy.internal.infrastructure.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AcademyService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AcademyService(CourseRepository courseRepository,
                          LessonRepository lessonRepository,
                          EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    public Course createCourse(UUID teacherId, String title, String description, BigDecimal price) {
        Course course = new Course(UUID.randomUUID(), teacherId, title, description, price);
        return courseRepository.save(course);
    }

    public Lesson addLesson(UUID courseId, String title, String content, String videoUrl, Integer orderIndex) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        
        Lesson lesson = new Lesson(UUID.randomUUID(), course.getId(), title, content, videoUrl, orderIndex);
        return lessonRepository.save(lesson);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourse(UUID courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
    }

    public List<Lesson> getCourseLessons(UUID courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public Enrollment enrollStudent(UUID courseId, UUID studentId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        
        if (enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId).isPresent()) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment(UUID.randomUUID(), course.getId(), studentId);
        return enrollmentRepository.save(enrollment);
    }
    
    public boolean isEnrolled(UUID courseId, UUID studentId) {
        return enrollmentRepository.findByCourseIdAndStudentId(courseId, studentId).isPresent();
    }
}
