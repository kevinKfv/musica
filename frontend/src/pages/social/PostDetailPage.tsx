import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocialStore } from '../../store/useSocialStore';
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Send } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

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

export const PostDetailPage: React.FC = () => {
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
    <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Button 
        variant="ghost"
        onClick={() => navigate('/social')}
        style={{ alignSelf: 'flex-start', color: 'var(--bh-text-secondary, #a1a1aa)', paddingLeft: 0 }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '6px' }} />
        Volver a la Comunidad
      </Button>

      {isLoading && !post ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
          Cargando publicación...
        </div>
      ) : error ? (
        <Card style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '1.5rem'
        }}>
          ⚠️ {error}
        </Card>
      ) : post ? (
        <>
          {/* Main Post Card */}
          <Card style={{
            background: 'var(--bh-bg-surface, #12121a)',
            border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            display: 'flex',
          }}>
            {/* Voting Column */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '1.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.01)',
              borderRight: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
              minWidth: '56px',
            }}>
              <button
                onClick={() => upvote(post.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bh-text-secondary, #a1a1aa)', padding: '4px', borderRadius: '4px' }}
                title="Upvote"
              >
                <ArrowUp style={{ width: '18px', height: '18px' }} />
              </button>
              <span style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: post.score > 0 ? '#f97316' : post.score < 0 ? 'var(--bh-primary, #6366f1)' : 'var(--bh-text-secondary, #a1a1aa)'
              }}>
                {post.score}
              </span>
              <button
                onClick={() => downvote(post.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bh-text-secondary, #a1a1aa)', padding: '4px', borderRadius: '4px' }}
                title="Downvote"
              >
                <ArrowDown style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* Post Content */}
            <div style={{ flex: 1, padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--bh-primary, #6366f1)',
                  background: 'rgba(99, 102, 241, 0.12)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                }}>
                  {post.category}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: POST_TYPE_CONFIG[post.postType]?.color ?? 'var(--bh-primary, #6366f1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                }}>
                  {POST_TYPE_CONFIG[post.postType]?.label}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
                  por <strong style={{ color: '#fff' }}>{authorLabel(post.authorEmail)}</strong> · {timeAgo(post.createdAt)}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--bh-font-display, Syne)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '1rem',
                lineHeight: 1.3
              }}>
                {post.title}
              </h1>

              {post.content && (
                <p style={{ color: 'var(--bh-text-secondary, #cbd5e1)', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '1.25rem' }}>
                  {post.content}
                </p>
              )}

              {post.linkUrl && (
                <a
                  href={post.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: '#a5b4fc',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem',
                    textDecoration: 'none'
                  }}
                >
                  🔗 {post.linkUrl}
                </a>
              )}

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--bh-text-secondary, #a1a1aa)', borderTop: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))', paddingTop: '1rem' }}>
                <span>▲ {post.upvotes} votos a favor</span>
                <span>▼ {post.downvotes} votos en contra</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare style={{ width: '14px', height: '14px' }} />
                  {post.commentCount} comentarios
                </span>
              </div>
            </div>
          </Card>

          {/* Comment Form */}
          <Card style={{
            background: 'var(--bh-bg-surface, #12121a)',
            border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '1.25rem',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
              Dejar un comentario
            </h3>
            <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Comparte tu opinión con la comunidad..."
                rows={3}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                  borderRadius: '0.75rem',
                  padding: '0.875rem 1rem',
                  color: '#fff',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCommenting || !commentText.trim()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                  {isCommenting ? 'Enviando...' : 'Comentar'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(post.comments || []).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.95rem', padding: '1.5rem 0' }}>
                Sé el primero en iniciar la conversación 🎵
              </p>
            ) : (
              (post.comments || []).map(comment => (
                <Card key={comment.id} style={{
                  background: 'var(--bh-bg-surface, #12121a)',
                  border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--bh-primary, #6366f1), #ec4899)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}>
                      {comment.authorEmail.substring(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                      {authorLabel(comment.authorEmail)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--bh-text-secondary, #cbd5e1)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                  </p>
                </Card>
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PostDetailPage;
