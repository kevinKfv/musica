import React, { useState } from 'react';
import { useSocialStore } from '../../../store/useSocialStore';
import type { CreatePostRequest, PostType } from '../../../api/socialApi';

const CATEGORIES = [
    'Guitarristas', 'Bateristas', 'Productores', 'Composición',
    'Bandas', 'Gear', 'Teoría Musical', 'Producción', 'General'
];

const POST_TYPES: { key: PostType; label: string; icon: string; desc: string }[] = [
    { key: 'DISCUSSION', label: 'Debate', icon: '💬', desc: 'Texto libre' },
    { key: 'QUESTION',   label: 'Pregunta', icon: '❓', desc: 'Pide ayuda' },
    { key: 'MUSIC',      label: 'Música', icon: '🎵', desc: 'Link o track' },
    { key: 'IMAGE',      label: 'Imagen', icon: '🖼', desc: 'Foto o diagrama' },
];

interface CreatePostFormProps {
    onClose?: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onClose }) => {
    const [postType, setPostType] = useState<PostType>('DISCUSSION');
    const [category, setCategory] = useState('General');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const createPost = useSocialStore(s => s.createPost);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { setError('El título es obligatorio'); return; }
        setError('');
        setIsSubmitting(true);
        try {
            const req: CreatePostRequest = {
                title: title.trim(),
                content: content.trim() || undefined,
                category,
                postType,
                linkUrl: linkUrl.trim() || undefined,
            };
            await createPost(req);
            setTitle(''); setContent(''); setLinkUrl('');
            onClose?.();
        } catch {
            setError('No se pudo publicar. ¿Estás logueado?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 14,
            padding: 24,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>
                Nueva publicación
            </h2>

            {/* Post type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {POST_TYPES.map(t => {
                    const active = postType === t.key;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setPostType(t.key)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '7px 14px',
                                borderRadius: 8,
                                border: active ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(51,65,85,0.7)',
                                background: active ? 'rgba(99,102,241,0.2)' : 'rgba(30,41,59,0.5)',
                                color: active ? '#a5b4fc' : '#64748b',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                transition: 'all 0.15s',
                            }}
                        >
                            {t.icon} {t.label}
                        </button>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Category + Title row */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{
                            background: 'rgba(30,41,59,0.8)',
                            border: '1px solid rgba(51,65,85,0.7)',
                            borderRadius: 8,
                            color: '#e2e8f0',
                            padding: '10px 12px',
                            fontSize: 13,
                            flexShrink: 0,
                            cursor: 'pointer',
                        }}
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Título de tu publicación *"
                        maxLength={200}
                        style={{
                            flex: 1,
                            background: 'rgba(30,41,59,0.8)',
                            border: '1px solid rgba(51,65,85,0.7)',
                            borderRadius: 8,
                            color: '#e2e8f0',
                            padding: '10px 14px',
                            fontSize: 14,
                            outline: 'none',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,65,85,0.7)')}
                    />
                </div>

                {/* Content */}
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={postType === 'QUESTION' ? 'Describí tu pregunta en detalle...' : 'Contenido (opcional si tiene título)'}
                    rows={4}
                    style={{
                        background: 'rgba(30,41,59,0.8)',
                        border: '1px solid rgba(51,65,85,0.7)',
                        borderRadius: 8,
                        color: '#e2e8f0',
                        padding: '10px 14px',
                        fontSize: 14,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        outline: 'none',
                        minHeight: 100,
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,65,85,0.7)')}
                />

                {/* Link URL (for MUSIC type) */}
                {(postType === 'MUSIC' || postType === 'IMAGE') && (
                    <input
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        placeholder={postType === 'MUSIC' ? '🎵 Link de SoundCloud, Spotify, YouTube...' : '🖼 Link de imagen'}
                        style={{
                            background: 'rgba(30,41,59,0.8)',
                            border: '1px solid rgba(51,65,85,0.7)',
                            borderRadius: 8,
                            color: '#e2e8f0',
                            padding: '10px 14px',
                            fontSize: 14,
                            outline: 'none',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,65,85,0.7)')}
                    />
                )}

                {error && (
                    <p style={{ margin: 0, fontSize: 13, color: '#f87171' }}>{error}</p>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                    {onClose && (
                        <button type="button" onClick={onClose} style={{
                            padding: '9px 20px',
                            borderRadius: 8,
                            border: '1px solid rgba(51,65,85,0.7)',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: 14,
                        }}>
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim()}
                        style={{
                            padding: '9px 24px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: '#fff',
                            cursor: isSubmitting || !title.trim() ? 'not-allowed' : 'pointer',
                            fontSize: 14,
                            fontWeight: 600,
                            opacity: isSubmitting || !title.trim() ? 0.5 : 1,
                            transition: 'opacity 0.15s',
                        }}
                    >
                        {isSubmitting ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </form>
        </div>
    );
};
