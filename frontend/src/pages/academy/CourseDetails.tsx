import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academyApi, Course, Lesson } from '../../api/academyApi';
import { BookOpen, CheckCircle, PlayCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const studentId = '44444444-4444-4444-4444-444444444444'; // Mock user ID

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

      const enrolled = await academyApi.checkEnrollmentStatus(id!, studentId);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleEnroll = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await academyApi.enrollStudent(id, studentId);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Error al inscribirse al curso.');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
        Cargando detalles del curso...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <Button 
        variant="ghost"
        onClick={() => navigate('/academy')}
        style={{ alignSelf: 'flex-start', color: 'var(--bh-text-secondary, #a1a1aa)', paddingLeft: 0 }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '6px' }} />
        Volver a la Academia
      </Button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Course Header & Lessons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 2' }}>
          <Card style={{
            background: 'var(--bh-bg-surface, #12121a)',
            border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '1.25rem',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '220px',
              backgroundImage: "url('https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2000&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--bh-bg-surface, #12121a) 0%, transparent 80%)'
              }} />
            </div>

            <div style={{ padding: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                {course.title}
              </h1>
              <p style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <BookOpen style={{ width: '20px', height: '20px', color: 'var(--bh-primary, #6366f1)' }} />
                <h3 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Temario y Clases ({lessons.length})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.06))',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--bh-primary, #6366f1)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.25rem' }}>{lesson.title}</h4>
                      {lesson.videoUrl && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
                          <PlayCircle style={{ width: '13px', height: '13px', color: '#10b981' }} /> Video HD incluido
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <p style={{ color: 'var(--bh-text-secondary, #a1a1aa)', fontStyle: 'italic', margin: '0.5rem 0' }}>
                    No hay lecciones publicadas aún en este curso.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Pricing & Enrollment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card style={{
            background: 'var(--bh-bg-surface, #12121a)',
            border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '1.25rem',
            padding: '2rem',
            boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
            position: 'sticky',
            top: '1.5rem',
          }}>
            <h3 style={{ fontFamily: 'var(--bh-font-display, Syne)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--bh-primary, #6366f1)', textAlign: 'center', marginBottom: '1.25rem' }}>
              Inscripción
            </h3>
            
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--bh-font-display, Syne)' }}>
                ${course.price}
              </span>
              <span style={{ color: 'var(--bh-text-secondary, #a1a1aa)', marginLeft: '0.5rem', fontSize: '1rem' }}>USD</span>
            </div>

            {isEnrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  <CheckCircle style={{ width: '20px', height: '20px' }} />
                  ¡Ya estás matriculado!
                </div>
                <Button 
                  variant="primary"
                  onClick={() => navigate(`/academy/${id}/learn`)}
                  style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', fontWeight: 700 }}
                >
                  Ir al Aula Virtual
                </Button>
              </div>
            ) : (
              <Button 
                variant="primary"
                onClick={handleEnroll}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981, #06b6d4)'
                }}
              >
                {loading ? 'Inscribiendo...' : 'Inscribirme Ahora'}
              </Button>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} /> Acceso ilimitado de por vida
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} /> Prácticas y recursos descargables
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} /> Certificado de acreditación BandHub
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
