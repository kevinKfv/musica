import { apiClient } from './apiClient';

export type PostType = 'DISCUSSION' | 'MUSIC' | 'QUESTION' | 'IMAGE';

export interface CommentDTO {
    id: string;
    authorEmail: string;
    content: string;
    createdAt: string;
}

export interface PostMediaDTO {
    id?: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO';
}

export interface PostDTO {
    id: string;
    authorEmail: string;
    title: string;
    content: string;
    linkUrl?: string;
    category: string;
    postType: PostType;
    upvotes: number;
    downvotes: number;
    score: number;
    commentCount: number;
    createdAt: string;
    media?: PostMediaDTO[];
    comments?: CommentDTO[];
}

export interface CreatePostRequest {
    title: string;
    content?: string;
    category: string;
    postType: PostType;
    linkUrl?: string;
    media?: PostMediaDTO[];
}

export const socialApi = {
    getFeed: async (category?: string, sort: string = 'new'): Promise<PostDTO[]> => {
        const params = new URLSearchParams({ sort });
        if (category && category !== 'all') params.append('category', category);
        const response = await apiClient.get<PostDTO[]>(`/social/feed?${params}`);
        return response.data;
    },

    getPost: async (postId: string): Promise<PostDTO> => {
        const response = await apiClient.get<PostDTO>(`/social/posts/${postId}`);
        return response.data;
    },

    createPost: async (request: CreatePostRequest): Promise<PostDTO> => {
        const response = await apiClient.post<PostDTO>('/social/posts', request);
        return response.data;
    },

    addComment: async (postId: string, content: string): Promise<void> => {
        await apiClient.post(`/social/posts/${postId}/comments`, { content });
    },

    upvote: async (postId: string): Promise<void> => {
        await apiClient.post(`/social/posts/${postId}/upvote`);
    },

    downvote: async (postId: string): Promise<void> => {
        await apiClient.post(`/social/posts/${postId}/downvote`);
    },

    followUser: async (targetId: string): Promise<void> => {
        await apiClient.post(`/social/follow/${targetId}`);
    }
};
