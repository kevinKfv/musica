import { create } from 'zustand';
import { socialApi, PostDTO, CreatePostRequest } from '../api/socialApi';

export type SortMode = 'new' | 'top' | 'hot';

const SAMPLE_POSTS: PostDTO[] = [
  {
    id: 'p1',
    authorEmail: 'juan@bandhub.com',
    title: '¿Qué guitarra recomiendan para principiantes?',
    content: 'Estoy empezando y tengo un presupuesto de ~300 USD. Vi la Yamaha Pacifica 112V y la Squier Classic Vibe. ¿Alguna experiencia con estas?',
    category: 'Guitarristas',
    postType: 'QUESTION',
    upvotes: 42,
    downvotes: 1,
    score: 41,
    commentCount: 8,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    media: [],
    comments: [
      { id: 'c1', authorEmail: 'maria@bandhub.com', content: 'La Pacifica 112V tiene mejor relación precio/calidad para arrancar, la configuración HSS es súper versátil.', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() }
    ],
  },
  {
    id: 'p2',
    authorEmail: 'maria@bandhub.com',
    title: 'Grabé mi primera canción 🎵',
    content: 'Después de 6 meses de práctica y estudio, finalmente terminé de grabar mi primera canción. Es un folk acústico con influencias de Nick Drake y Spinetta.',
    category: 'Composición',
    postType: 'MUSIC',
    linkUrl: 'https://soundcloud.com/example',
    upvotes: 89,
    downvotes: 0,
    score: 89,
    commentCount: 14,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    media: [],
    comments: [],
  },
  {
    id: 'p3',
    authorEmail: 'admin@bandhub.com',
    title: 'Tutorial: Cómo mezclar batería en producción moderna',
    content: 'En este post voy a explicar las técnicas básicas de compresión paralela (New York Style), EQ sustractiva y reverb de sala para lograr una batería con pegada y presencia.',
    category: 'Producción',
    postType: 'DISCUSSION',
    upvotes: 112,
    downvotes: 2,
    score: 110,
    commentCount: 23,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    media: [],
    comments: [],
  },
  {
    id: 'p4',
    authorEmail: 'juan@bandhub.com',
    title: 'Banda busca baterista - Buenos Aires',
    content: 'Somos una banda de rock alternativo buscando baterista con experiencia. Tocamos temas propios y ensayamos sábados en salas de Palermo.',
    category: 'Bandas',
    postType: 'DISCUSSION',
    upvotes: 29,
    downvotes: 1,
    score: 28,
    commentCount: 5,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    media: [],
    comments: [],
  },
];

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
    feed: SAMPLE_POSTS,
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
            if (data && data.length > 0) {
                set({ feed: data, isLoading: false });
            } else {
                const filtered = activeCategory === 'all'
                    ? SAMPLE_POSTS
                    : SAMPLE_POSTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
                set({ feed: filtered, isLoading: false });
            }
        } catch {
            const filtered = activeCategory === 'all'
                ? SAMPLE_POSTS
                : SAMPLE_POSTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
            set({ feed: filtered, isLoading: false, error: null });
        }
    },

    fetchPost: async (postId: string) => {
        set({ isLoading: true, error: null });
        try {
            const post = await socialApi.getPost(postId);
            set({ currentPost: post, isLoading: false });
        } catch {
            const sample = SAMPLE_POSTS.find(p => p.id === postId) || SAMPLE_POSTS[0];
            set({ currentPost: sample, isLoading: false, error: null });
        }
    },

    createPost: async (request: CreatePostRequest) => {
        try {
            const newPost = await socialApi.createPost(request);
            set((state) => ({ feed: [newPost, ...state.feed] }));
        } catch {
            const localPost: PostDTO = {
                id: `post-${Date.now()}`,
                authorEmail: 'usuario@bandhub.com',
                title: request.title,
                content: request.content || '',
                category: request.category,
                postType: request.postType,
                linkUrl: request.linkUrl,
                upvotes: 1,
                downvotes: 0,
                score: 1,
                commentCount: 0,
                createdAt: new Date().toISOString(),
                comments: [],
            };
            set((state) => ({ feed: [localPost, ...state.feed] }));
        }
    },

    addComment: async (postId: string, content: string) => {
        try {
            await socialApi.addComment(postId, content);
            await get().fetchPost(postId);
        } catch {
            const current = get().currentPost;
            if (current && current.id === postId) {
                const newComment = {
                    id: `c-${Date.now()}`,
                    authorEmail: 'usuario@bandhub.com',
                    content,
                    createdAt: new Date().toISOString(),
                };
                set({
                    currentPost: {
                        ...current,
                        comments: [...(current.comments || []), newComment],
                        commentCount: (current.commentCount || 0) + 1,
                    }
                });
            }
        }
    },

    upvote: async (postId: string) => {
        set((state) => ({
            feed: state.feed.map(p =>
                p.id === postId ? { ...p, upvotes: p.upvotes + 1, score: p.score + 1 } : p
            )
        }));
        try {
            await socialApi.upvote(postId);
        } catch {
            // Optimistic keeps vote
        }
    },

    downvote: async (postId: string) => {
        set((state) => ({
            feed: state.feed.map(p =>
                p.id === postId ? { ...p, downvotes: p.downvotes + 1, score: p.score - 1 } : p
            )
        }));
        try {
            await socialApi.downvote(postId);
        } catch {
            // Optimistic keeps vote
        }
    },

    setCategory: (category: string) => {
        set({ activeCategory: category });
        setTimeout(() => get().fetchFeed(), 0);
    },

    setSort: (sort: SortMode) => {
        set({ sortMode: sort });
        setTimeout(() => get().fetchFeed(), 0);
    },
}));
