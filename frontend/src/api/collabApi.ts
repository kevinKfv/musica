import { apiClient } from './apiClient';

export interface CollabProject {
    id: string;
    ownerId: string;
    title: string;
    description: string;
    status: string;
    stems: AudioStem[];
    createdAt: string;
}

export interface AudioStem {
    id: string;
    uploaderId: string;
    fileUrl: string;
    name: string;
    comments: TimelineComment[];
}

export interface TimelineComment {
    id: string;
    authorId: string;
    timestampSeconds: number;
    content: string;
}

export const collabApi = {
    createProject: (data: { title: string; description: string }) => 
        apiClient.post<CollabProject>('/collab/projects', data).then(res => res.data),
    
    getProjects: () => 
        apiClient.get<CollabProject[]>('/collab/projects').then(res => res.data),
        
    getProjectDetails: (id: string) => 
        apiClient.get<CollabProject>(`/collab/projects/${id}`).then(res => res.data),
        
    uploadStem: (projectId: string, data: { name: string; fileUrl: string }) =>
        apiClient.post<AudioStem>(`/collab/projects/${projectId}/stems`, data).then(res => res.data),
        
    addComment: (stemId: string, data: { timestampSeconds: number; content: string }) =>
        apiClient.post<TimelineComment>(`/collab/stems/${stemId}/comments`, data).then(res => res.data)
};
