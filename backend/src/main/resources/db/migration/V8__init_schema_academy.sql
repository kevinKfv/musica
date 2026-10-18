CREATE SCHEMA IF NOT EXISTS schema_academy;

CREATE TABLE schema_academy.courses (
    id UUID PRIMARY KEY,
    teacher_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_academy.lessons (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES schema_academy.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url VARCHAR(1024),
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE schema_academy.enrollments (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES schema_academy.courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, student_id)
);
