import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academyApi, Course, Lesson } from '../../api/academyApi';
import { PlayCircle, CheckCircle, ChevronRight, ChevronLeft, Menu, BookOpen, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CourseLearning = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const currentCourse = await academyApi.getCourse(id!);
      setCourse(currentCourse);

      const courseLessons = await academyApi.getLessons(id!);
      setLessons(courseLessons);
    } catch (error) {
      console.error('Error fetching course details:', error);
      navigate('/academy');
    }
  };

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
        Cargando aula virtual...
      </div>
    );
  }

  const activeLesson = lessons[activeLessonIndex];

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      height: 'calc(100vh - 120px)',
      display: 'flex',
      gap: '1rem',
      overflow: 'hidden',
    }}>
      {/* Sidebar - Lessons List */}
      <Card style={{
        width: sidebarOpen ? '320px' : '0px',
        opacity: sidebarOpen ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: sidebarOpen ? '1.25rem' : '0',
        border: sidebarOpen ? '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))' : 'none',
        background: 'var(--bh-bg-surface, #12121a)',
        borderRadius: '1.25rem',
        flexShrink: 0,
      }}>
        <div style={{ borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/academy/${id}`)}
            style={{ color: 'var(--bh-text-secondary, #a1a1aa)', paddingLeft: 0, marginBottom: '0.75rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px', marginRight: '4px' }} />
            Volver al temario
          </Button>
          <h2 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.3 }}>
            {course.title}
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--bh-primary, #6366f1)', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
            {lessons.length} Lecciones
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
          {lessons.map((lesson, index) => {
            const isCurrent = activeLessonIndex === index;
            const isDone = activeLessonIndex > index;
            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLessonIndex(index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  border: isCurrent ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isCurrent ? '#fff' : 'var(--bh-text-secondary, #a1a1aa)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {isDone ? (
                    <CheckCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />
                  ) : (
                    <PlayCircle style={{ width: '18px', height: '18px', color: isCurrent ? 'var(--bh-primary, #6366f1)' : 'var(--bh-text-secondary, #a1a1aa)' }} />
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.7, textTransform: 'uppercase' }}>
                    Lección {index + 1}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isCurrent ? '#fff' : 'var(--bh-text-secondary, #a1a1aa)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lesson.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Main Learning Canvas */}
      <Card style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bh-bg-surface, #12121a)',
        border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
        borderRadius: '1.25rem',
        overflow: 'hidden',
      }}>
        {/* Top Control Bar */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(255, 255, 255, 0.01)',
          flexShrink: 0
        }}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
              borderRadius: '0.5rem',
              color: 'var(--bh-text-secondary, #a1a1aa)',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
          >
            <Menu style={{ width: '18px', height: '18px' }} />
          </button>
          <h1 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeLesson ? activeLesson.title : 'Aula Virtual'}
          </h1>
        </div>

        {/* Scrollable Lesson Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
          {activeLesson ? (
            <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {activeLesson.videoUrl && (
                <div style={{
                  aspectRatio: '16/9',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
                  background: '#000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(activeLesson.videoUrl) || ''}
                    title="Reproductor de clase"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
                borderRadius: '1rem',
                padding: '1.75rem',
              }}>
                <h2 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                  {activeLesson.title}
                </h2>
                <div style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '1rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {activeLesson.content.split('\n').map((paragraph, i) => (
                    <p key={i} style={{ margin: 0 }}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Lesson Nav Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', paddingBottom: '2rem' }}>
                <Button 
                  variant="secondary"
                  disabled={activeLessonIndex === 0}
                  onClick={() => setActiveLessonIndex(prev => prev - 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <ChevronLeft style={{ width: '16px', height: '16px' }} />
                  Anterior
                </Button>
                
                <Button 
                  variant="primary"
                  disabled={activeLessonIndex === lessons.length - 1}
                  onClick={() => setActiveLessonIndex(prev => prev + 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Siguiente Lección
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--bh-text-secondary, #a1a1aa)', textAlign: 'center', padding: '3rem' }}>
              <BookOpen style={{ width: '48px', height: '48px', marginBottom: '1rem', opacity: 0.4 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Aún no hay lecciones</h3>
              <p>El docente está preparando los materiales didácticos.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
