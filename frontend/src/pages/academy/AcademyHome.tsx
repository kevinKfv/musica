import React, { useState, useEffect } from 'react';
import { academyApi, Course } from '../../api/academyApi';
import { useNavigate } from 'react-router-dom';
import { BookOpen, DollarSign, Plus, GraduationCap } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const AcademyHome = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await academyApi.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={18} />
            </span>
            <h1
              style={{
                fontFamily: 'var(--bh-font-display, "Syne", sans-serif)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
              }}
            >
              Academia Musical
            </h1>
          </div>
          <p style={{ margin: 0, color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.875rem' }}>
            Masterclasses, cursos técnicos y lecciones interactivas para músicos y productores.
          </p>
        </div>

        <Button
          onClick={() => navigate('/academy/create')}
          icon={<Plus size={16} />}
        >
          Publicar Curso
        </Button>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <Card style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Cargando catálogo de cursos...
        </Card>
      ) : courses.length === 0 ? (
        <Card
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <BookOpen size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f4f4f5', margin: '0 0 6px' }}>
              No hay cursos disponibles por el momento
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: 0, maxWidth: '380px' }}>
              Compartí tus conocimientos como profesor o instructor y creá el primer curso de la academia.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/academy/create')}
            icon={<Plus size={14} />}
          >
            Crear mi primer curso
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {courses.map((course) => (
            <Card
              key={course.id}
              onClick={() => navigate(`/academy/${course.id}`)}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%), url("https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=1000&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardHeader style={{ padding: '1.25rem' }}>
                <CardTitle style={{ fontSize: '1.125rem' }}>{course.title}</CardTitle>
                {course.description && (
                  <CardDescription style={{ marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent style={{ padding: '0 1.25rem 1.25rem', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--bh-font-display, "Syne", sans-serif)', fontSize: '1.125rem', fontWeight: 800, color: '#38bdf8' }}>
                    ${course.price}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#a78bfa', fontWeight: 600 }}>
                    Ver lecciones &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
