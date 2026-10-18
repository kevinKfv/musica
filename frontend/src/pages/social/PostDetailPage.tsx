import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocialStore } from '../../store/useSocialStore';

const POST_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
    DISCUSSION: { label: 'Debate', color: '#6366f1' },
    MUSIC: { label: '🎵 Música', color: '#10b981' },
    QUESTION: { label: '❓ Pregunta', color: '#f59e0b' },
    IMAGE: { label: '🖼 Imagen', color: '#ec4899' },
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora mismo';
    if (mins < 60) return `hace ${mins} minutos`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs} horas`;
    return `hace ${Math.floor(hrs / 24)} días`;
}

function authorLabel(email: string) { return email.split('@')[0]; }

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { currentPost, isLoading, error, fetchPost, upvote, downvote, addComment } = useSocialStore();
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    useEffect(() => {
        if (postId) fetchPost(postId);
    }, [postId]);

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !postId) return;
        setIsCommenting(true);
        await addComment(postId, commentText.trim());
        setCommentText('');
        setIsCommenting(false);
    };

    const post = currentPost?.id === postId ? currentPost : null;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 100%)',
            padding: '24px 16px',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            <div style={{ maxWidth: 780, margin: '0 auto' }}>
                {/* Back button */}
                <button
                    onClick={() => navigate('/social')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        color: '#6366f1',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 20,
                        padding: 0,
                    }}
                >
                    ← Volver al foro
                </button>

                {isLoading && !post ? (
                    <div style={{ textAlign: 'center', padding: '64px 0' }}>
                        <div style={{
                            width: 40, height: 40,
                            border: '3px solid rgba(99,102,241,0.2)',
                            borderTop: '3px solid #6366f1',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            margin: '0 auto',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : error ? (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: 20, color: '#fca5a5' }}>
                        ⚠️ {error}
                    </div>
                ) : post ? (
                    <>
                        {/* Post body */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(15,23,42,0.8)',
                            border: '1px solid rgba(51,65,85,0.6)',
                            borderRadius: 14,
                            overflow: 'hidden',
                            marginBottom: 16,
                            backdropFilter: 'blur(8px)',
                        }}>
                            {/* Vote column */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 6,
                                padding: '20px 14px',
                                background: 'rgba(15,23,42,0.5)',
                                minWidth: 60,
                            }}>
                                <button
                                    onClick={() => upvote(post.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22, padding: 4, borderRadius: 4 }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                                >▲</button>
                                <span style={{ fontSize: 18, fontWeight: 800, color: post.score > 0 ? '#f97316' : post.score < 0 ? '#6366f1' : '#94a3b8' }}>
                                    {post.score}
                                </span>
                                <button
                                    onClick={() => downvote(post.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22, padding: 4, borderRadius: 4 }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                                >▼</button>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, padding: '20px 24px' }}>
                                {/* Meta */}
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600,
                                        color: '#6366f1',
                                        background: 'rgba(99,102,241,0.12)',
                                        padding: '2px 8px', borderRadius: 20,
                                        border: '1px solid rgba(99,102,241,0.3)',
                                    }}>{post.category}</span>
                                    <span style={{
                                        fontSize: 11,
                                        color: POST_TYPE_CONFIG[post.postType]?.color ?? '#6366f1',
                                        background: 'rgba(99,102,241,0.08)',
                                        padding: '2px 8px', borderRadius: 20,
                                    }}>{POST_TYPE_CONFIG[post.postType]?.label}</span>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>
                                        por <strong style={{ color: '#94a3b8' }}>{authorLabel(post.authorEmail)}</strong>
                                        {' · '}{timeAgo(post.createdAt)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, color: '#e2e8f0', lineHeight: 1.3 }}>
                                    {post.title}
                                </h1>

                                {/* Content */}
                                {post.content && (
                                    <p style={{ margin: '0 0 16px', fontSize: 15, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                        {post.content}
                                    </p>
                                )}

                                {/* Link */}
                                {post.linkUrl && (
                                    <a
                                        href={post.linkUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            padding: '8px 14px',
                                            background: 'rgba(99,102,241,0.12)',
                                            border: '1px solid rgba(99,102,241,0.25)',
                                            borderRadius: 8,
                                            color: '#a5b4fc',
                                            textDecoration: 'none',
                                            fontSize: 13,
                                            marginBottom: 16,
                                        }}
                                    >
                                        🔗 {post.linkUrl}
                                    </a>
                                )}

                                {/* Stats */}
                                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
                                    <span>▲ {post.upvotes} upvotes</span>
                                    <span>▼ {post.downvotes} downvotes</span>
                                    <span>💬 {post.commentCount} comentarios</span>
                                </div>
                            </div>
                        </div>

                        {/* Comment form */}
                        <div style={{
                            background: 'rgba(15,23,42,0.8)',
                            border: '1px solid rgba(51,65,85,0.6)',
                            borderRadius: 12,
                            padding: 20,
                            marginBottom: 16,
                            backdropFilter: 'blur(8px)',
                        }}>
                            <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>
                                Dejar un comentario
                            </h3>
                            <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <textarea
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    placeholder="¿Qué pensás?"
                                    rows={3}
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
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(51,65,85,0.7)')}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="submit"
                                        disabled={isCommenting || !commentText.trim()}
                                        style={{
                                            padding: '8px 20px',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            color: '#fff',
                                            cursor: isCommenting || !commentText.trim() ? 'not-allowed' : 'pointer',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            opacity: isCommenting || !commentText.trim() ? 0.5 : 1,
                                        }}
                                    >
                                        {isCommenting ? 'Enviando...' : 'Comentar'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Comments list */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {post.comments.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, padding: '24px 0' }}>
                                    Sé el primero en comentar 🎵
                                </p>
                            ) : (
                                post.comments.map(comment => (
                                    <div key={comment.id} style={{
                                        background: 'rgba(15,23,42,0.6)',
                                        border: '1px solid rgba(51,65,85,0.4)',
                                        borderRadius: 10,
                                        padding: '14px 16px',
                                        backdropFilter: 'blur(8px)',
                                    }}>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                            <div style={{
                                                width: 28, height: 28,
                                                borderRadius: '50%',
                                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: '#fff',
                                            }}>
                                                {comment.authorEmail.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
                                                {authorLabel(comment.authorEmail)}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#475569' }}>
                                                {timeAgo(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                            {comment.content}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default PostDetailPage;
