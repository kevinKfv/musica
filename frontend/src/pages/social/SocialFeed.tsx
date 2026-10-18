import React, { useEffect, useState } from 'react';
import { useSocialStore, SortMode } from '../../store/useSocialStore';
import { PostCard } from './components/PostCard';
import { SortBar } from './components/SortBar';
import { CategorySidebar } from './components/CategorySidebar';
import { CreatePostForm } from './components/CreatePostForm';

const SocialFeed: React.FC = () => {
    const { feed, isLoading, error, fetchFeed, activeCategory, sortMode, setCategory, setSort } = useSocialStore();
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 50%, #0a0e1a 100%)',
            padding: '24px 16px',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            {/* Header */}
            <div style={{
                maxWidth: 1100,
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px',
                    }}>
                        🎵 BandHub Foro
                    </h1>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                        La comunidad de músicos de habla hispana
                    </p>
                </div>
                <button
                    id="new-post-btn"
                    onClick={() => setShowCreateForm(v => !v)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                        transition: 'box-shadow 0.2s, transform 0.1s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    }}
                >
                    ✏️ Nueva publicación
                </button>
            </div>

            {/* Create form inline */}
            {showCreateForm && (
                <div style={{ maxWidth: 1100, margin: '0 auto 20px' }}>
                    <CreatePostForm onClose={() => setShowCreateForm(false)} />
                </div>
            )}

            {/* Main layout: sidebar + feed */}
            <div style={{
                maxWidth: 1100,
                margin: '0 auto',
                display: 'flex',
                gap: 24,
                alignItems: 'flex-start',
            }}>
                {/* Category sidebar */}
                <CategorySidebar
                    activeCategory={activeCategory}
                    onSelect={setCategory}
                />

                {/* Feed column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Sort bar */}
                    <div style={{ marginBottom: 16 }}>
                        <SortBar sort={sortMode} onChange={setSort} />
                    </div>

                    {/* Feed content */}
                    {isLoading && feed.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 0' }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                border: '3px solid rgba(99,102,241,0.2)',
                                borderTop: '3px solid #6366f1',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                                margin: '0 auto',
                            }} />
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : error ? (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 10,
                            padding: 20,
                            color: '#fca5a5',
                            fontSize: 14,
                        }}>
                            ⚠️ {error}
                        </div>
                    ) : feed.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '64px 0',
                            color: '#64748b',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
                            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
                                No hay publicaciones todavía
                            </p>
                            <p style={{ margin: '8px 0 0', fontSize: 13 }}>
                                ¡Sé el primero en publicar en esta comunidad!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {feed.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right sidebar — stats / info */}
                <aside style={{
                    width: 200,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}>
                    <div style={{
                        background: 'rgba(15,23,42,0.7)',
                        border: '1px solid rgba(51,65,85,0.6)',
                        borderRadius: 12,
                        padding: 16,
                        backdropFilter: 'blur(8px)',
                    }}>
                        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>
                            🎸 Sobre el foro
                        </h3>
                        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
                            Comunidad para músicos: compartí tu música, hacé preguntas, encontrá banda.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                <span style={{ color: '#64748b' }}>Posts</span>
                                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{feed.length}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 12,
                        padding: 16,
                    }}>
                        <h3 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#a5b4fc' }}>
                            📋 Reglas
                        </h3>
                        <ol style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#64748b', lineHeight: 1.8 }}>
                            <li>Sé respetuoso</li>
                            <li>Sin spam</li>
                            <li>Contenido musical</li>
                            <li>Cita tus fuentes</li>
                        </ol>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default SocialFeed;
