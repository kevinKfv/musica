import { apiClient } from './apiClient';

export interface Course {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  videoUrl: string;
  orderIndex: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
}

export const academyApi = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await apiClient.get('/academy/courses');
    return response.data;
  },

  getCourse: async (courseId: string): Promise<Course> => {
    const response = await apiClient.get(`/academy/courses/${courseId}`);
    return response.data;
  },

  createCourse: async (courseData: {
    teacherId: string;
    title: string;
    description: string;
    price: number;
  }): Promise<Course> => {
    const response = await apiClient.post('/academy/courses', courseData);
    return response.data;
  },

  getLessons: async (courseId: string): Promise<Lesson[]> => {
    const response = await apiClient.get(`/academy/courses/${courseId}/lessons`);
    return response.data;
  },

  addLesson: async (courseId: string, lessonData: {
    title: string;
    content: string;
    videoUrl: string;
    orderIndex: number;
  }): Promise<Lesson> => {
    const response = await apiClient.post(`/academy/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },

  enrollStudent: async (courseId: string, studentId: string): Promise<Enrollment> => {
    const response = await apiClient.post(`/academy/courses/${courseId}/enroll`, { studentId });
    return response.data;
  },

  checkEnrollmentStatus: async (courseId: string, studentId: string): Promise<boolean> => {
    const response = await apiClient.get(`/academy/courses/${courseId}/enrollment-status?studentId=${studentId}`);
    return response.data.isEnrolled;
  }
};
