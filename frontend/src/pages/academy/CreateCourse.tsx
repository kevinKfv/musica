import React, { useState } from 'react';
import { academyApi } from '../../api/academyApi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
  });
  const [lessons, setLessons] = useState([{ title: '', content: '', videoUrl: '' }]);
  const [loading, setLoading] = useState(false);

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '', content: '', videoUrl: '' }]);
  };

  const handleRemoveLesson = (index: number) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleLessonChange = (index: number, field: string, value: string) => {
    const newLessons = [...lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    setLessons(newLessons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const teacherId = '33333333-3333-3333-3333-333333333333'; // Mock user ID

      const course = await academyApi.createCourse({
        teacherId,
        title: formData.title,
        description: formData.description,
        price: formData.price,
      });

      for (let i = 0; i < lessons.length; i++) {
        await academyApi.addLesson(course.id, {
          ...lessons[i],
          orderIndex: i,
        });
      }

      navigate('/academy');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/academy')}
          icon={<ArrowLeft size={16} />}
        >
          Volver a la Academia
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <BookOpen size={20} color="#3b82f6" />
            <CardTitle>Publicar Nuevo Curso o Masterclass</CardTitle>
          </div>
          <CardDescription>
            Compartí tus conocimientos estructurados en módulos de video y texto interactivo.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Título del curso *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. Producción y Mezcla de Guitarras Eléctricas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Precio de acceso (USD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Descripción del curso *</label>
                <textarea
                  required
                  rows={3}
                  className="form-input"
                  placeholder="Objetivos de aprendizaje, requisitos previos de software o instrumentos..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Lecciones */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#f4f4f5' }}>
                  Temario de Lecciones ({lessons.length})
                </h4>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddLesson}
                  icon={<Plus size={14} />}
                >
                  Agregar Lección
                </Button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {lessons.map((lesson, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#a78bfa' }}>
                        Lección #{index + 1}
                      </span>
                      {lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLesson(index)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Título de la lección *</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Ej. Microfoneo de amplificadores"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">URL del Video (YouTube / Vimeo)</label>
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://..."
                          value={lesson.videoUrl}
                          onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Contenido / Notas de la clase *</label>
                      <textarea
                        required
                        rows={2}
                        className="form-input"
                        placeholder="Puntos clave, archivos descargables, links..."
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(index, 'content', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate('/academy')}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={loading} icon={<Plus size={16} />}>
                Publicar Curso Completo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
