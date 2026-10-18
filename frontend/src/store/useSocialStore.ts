import { create } from 'zustand';
import { socialApi, PostDTO, CreatePostRequest } from '../api/socialApi';

export type SortMode = 'new' | 'top' | 'hot';

interface SocialState {
    feed: PostDTO[];
    currentPost: PostDTO | null;
    isLoading: boolean;
    error: string | null;
    activeCategory: string;
    sortMode: SortMode;

    fetchFeed: () => Promise<void>;
    fetchPost: (postId: string) => Promise<void>;
    createPost: (request: CreatePostRequest) => Promise<void>;
    addComment: (postId: string, content: string) => Promise<void>;
    upvote: (postId: string) => Promise<void>;
    downvote: (postId: string) => Promise<void>;
    setCategory: (category: string) => void;
    setSort: (sort: SortMode) => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
    feed: [],
    currentPost: null,
    isLoading: false,
    error: null,
    activeCategory: 'all',
    sortMode: 'new',

    fetchFeed: async () => {
        const { activeCategory, sortMode } = get();
        set({ isLoading: true, error: null });
        try {
            const data = await socialApi.getFeed(activeCategory, sortMode);
            set({ feed: data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchPost: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
            const post = await socialApi.getPost(postId);
            set({ currentPost: post, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createPost: async (request: CreatePostRequest) => {
        try {
            const newPost = await socialApi.createPost(request);
            set((state) => ({ feed: [newPost, ...state.feed] }));
        } catch (error: any) {
            console.error('Failed to create post', error);
            throw error;
        }
    },

    addComment: async (postId: string, content: string) => {
        try {
            await socialApi.addComment(postId, content);
            await get().fetchPost(postId);
        } catch (error: any) {
            console.error('Failed to add comment', error);
        }
    },

    upvote: async (postId: string) => {
        // Optimistic update
        set((state) => ({
            feed: state.feed.map(p =>
                p.id === postId ? { ...p, upvotes: p.upvotes + 1, score: p.score + 1 } : p
            )
        }));
        try {
            await socialApi.upvote(postId);
        } catch (error: any) {
            console.error('Failed to upvote', error);
            await get().fetchFeed(); // rollback
        }
    },

    downvote: async (postId: string) => {
        // Optimistic update
        set((state) => ({
            feed: state.feed.map(p =>
                p.id === postId ? { ...p, downvotes: p.downvotes + 1, score: p.score - 1 } : p
            )
        }));
        try {
            await socialApi.downvote(postId);
        } catch (error: any) {
            console.error('Failed to downvote', error);
            await get().fetchFeed(); // rollback
        }
    },

    setCategory: (category: string) => {
        set({ activeCategory: category });
        // Trigger feed refresh
        setTimeout(() => get().fetchFeed(), 0);
    },

    setSort: (sort: SortMode) => {
        set({ sortMode: sort });
        setTimeout(() => get().fetchFeed(), 0);
    },
}));
