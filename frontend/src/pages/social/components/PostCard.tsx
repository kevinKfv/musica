import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PostDTO } from '../../../api/socialApi';
import { useSocialStore } from '../../../store/useSocialStore';

interface PostCardProps {
    post: PostDTO;
    compact?: boolean;
}

const POST_TYPE_CONFIG = {
    DISCUSSION: { label: 'Debate', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    MUSIC: { label: '🎵 Música', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    QUESTION: { label: '❓ Pregunta', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    IMAGE: { label: '🖼 Imagen', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
};

const CATEGORY_COLORS: Record<string, string> = {
    'Guitarristas': '#10b981',
    'Bateristas': '#f59e0b',
    'Productores': '#8b5cf6',
    'Composición': '#06b6d4',
    'Bandas': '#ef4444',
    'Gear': '#f97316',
    'Teoría Musical': '#84cc16',
    'Producción': '#a855f7',
    'General': '#6b7280',
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
}

function authorLabel(email: string): string {
    return email.split('@')[0];
}

export const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
    const navigate = useNavigate();
    const upvote = useSocialStore(s => s.upvote);
    const downvote = useSocialStore(s => s.downvote);

    const typeConfig = POST_TYPE_CONFIG[post.postType] ?? POST_TYPE_CONFIG.DISCUSSION;
    const catColor = CATEGORY_COLORS[post.category] ?? '#6b7280';

    return (
        <article
            style={{
                display: 'flex',
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(51,65,85,0.6)',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
            }}
            onClick={() => navigate(`/social/${post.id}`)}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(99,102,241,0.08)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(51,65,85,0.6)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
        >
            {/* Score column */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '16px 10px',
                background: 'rgba(15,23,42,0.5)',
                minWidth: 52,
            }}>
                <button
                    onClick={e => { e.stopPropagation(); upvote(post.id); }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: 18,
                        lineHeight: 1,
                        padding: 4,
                        borderRadius: 4,
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                    title="Upvote"
                >
                    ▲
                </button>
                <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: post.score > 0 ? '#f97316' : post.score < 0 ? '#6366f1' : '#94a3b8',
                    minWidth: 24,
                    textAlign: 'center',
                }}>
                    {post.score}
                </span>
                <button
                    onClick={e => { e.stopPropagation(); downvote(post.id); }}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: 18,
                        lineHeight: 1,
                        padding: 4,
                        borderRadius: 4,
                        transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                    title="Downvote"
                >
                    ▼
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '12px 16px', minWidth: 0 }}>
                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: catColor,
                        background: `${catColor}18`,
                        padding: '2px 8px',
                        borderRadius: 20,
                        border: `1px solid ${catColor}30`,
                    }}>
                        {post.category}
                    </span>
                    <span style={{
                        fontSize: 11,
                        color: typeConfig.color,
                        background: typeConfig.bg,
                        padding: '2px 8px',
                        borderRadius: 20,
                    }}>
                        {typeConfig.label}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>
                        por <strong style={{ color: '#94a3b8' }}>{authorLabel(post.authorEmail)}</strong>
                        {' · '}{timeAgo(post.createdAt)}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    margin: '0 0 6px',
                    fontSize: compact ? 15 : 17,
                    fontWeight: 700,
                    color: '#e2e8f0',
                    lineHeight: 1.4,
                }}>
                    {post.title || post.content?.substring(0, 80)}
                </h3>

                {/* Content preview */}
                {!compact && post.content && post.title && (
                    <p style={{
                        margin: '0 0 10px',
                        fontSize: 13,
                        color: '#94a3b8',
                        lineHeight: 1.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    } as any}>
                        {post.content}
                    </p>
                )}

                {/* Link preview */}
                {post.linkUrl && (
                    <a
                        href={post.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 12,
                            color: '#6366f1',
                            textDecoration: 'none',
                            marginBottom: 8,
                        }}
                    >
                        🔗 {post.linkUrl.replace(/^https?:\/\//, '').substring(0, 50)}
                    </a>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        💬 {post.commentCount} comentarios
                    </span>
                    <button
                        onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(window.location.origin + `/social/${post.id}`); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#64748b', padding: 0 }}
                    >
                        🔗 Compartir
                    </button>
                </div>
            </div>
        </article>
    );
};
