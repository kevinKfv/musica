import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academyApi, Course, Lesson } from '../../api/academyApi';
import { BookOpen, CheckCircle, PlayCircle, DollarSign } from 'lucide-react';

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
    return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <button 
            onClick={() => navigate('/academy')}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 transition-colors"
          >
            &larr; Volver a la Academia
          </button>

          <div className="bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="h-64 bg-slate-700 bg-[url('https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
            
            <div className="p-8">
              <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {course.description}
              </p>

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-blue-400" /> 
                Temario del Curso
              </h3>
              
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-slate-900 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                    <div className="bg-slate-800 text-blue-400 font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-lg font-semibold text-white">{lesson.title}</h4>
                      {lesson.videoUrl && (
                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                          <PlayCircle className="w-4 h-4" /> Video disponible
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {lessons.length === 0 && (
                  <div className="text-slate-500 italic">No hay lecciones publicadas aún.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 mt-14 lg:mt-0 relative">
          <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl sticky top-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-400">Inscripción</h3>
            <div className="text-center mb-8">
              <span className="text-5xl font-extrabold text-white">${course.price}</span>
              <span className="text-slate-400 ml-2">USD</span>
            </div>

            {isEnrolled ? (
              <div className="space-y-4">
                <div className="bg-emerald-900/30 border border-emerald-500 p-4 rounded-xl text-emerald-400 flex flex-col items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-8 h-8" />
                  <span className="font-bold">¡Ya estás inscrito!</span>
                </div>
                <button 
                  onClick={() => navigate(`/academy/${id}/learn`)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] text-lg"
                >
                  Ir al Aula Virtual
                </button>
              </div>
            ) : (
              <button 
                onClick={handleEnroll}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50 text-lg"
              >
                {loading ? 'Inscribiendo...' : 'Inscribirme Ahora'}
              </button>
            )}

            <ul className="mt-8 space-y-3 text-slate-400 text-sm">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Acceso de por vida</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Aprende a tu propio ritmo</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Certificado al finalizar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
