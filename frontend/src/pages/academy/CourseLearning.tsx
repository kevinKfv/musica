import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { academyApi, Course, Lesson } from '../../api/academyApi';
import { PlayCircle, CheckCircle, ChevronRight, Menu, BookOpen } from 'lucide-react';

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
      navigate('/academy'); // if error or not enrolled, back to academy
    }
  };

  if (!course) {
    return <div className="min-h-screen bg-slate-900 text-white flex justify-center items-center">Cargando aula virtual...</div>;
  }

  const activeLesson = lessons[activeLessonIndex];

  // A helper function to extract YouTube embed URL from standard URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url; // fallback
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar - Playlist */}
      <div className={`${sidebarOpen ? 'w-full md:w-80' : 'w-0'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden`}>
        <div className="p-6 border-b border-slate-800 shrink-0">
          <button 
            onClick={() => navigate(`/academy/${id}`)}
            className="text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          >
            &larr; Volver al curso
          </button>
          <h2 className="text-xl font-bold text-white line-clamp-2">{course.title}</h2>
          <p className="text-blue-400 text-sm mt-1">{lessons.length} Lecciones</p>
        </div>
        <div className="overflow-y-auto flex-grow p-4 space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonIndex(index)}
              className={`w-full text-left p-4 rounded-xl flex items-start gap-3 transition-colors ${
                activeLessonIndex === index 
                  ? 'bg-blue-600/20 border border-blue-500/50 text-white' 
                  : 'bg-slate-800/50 border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="mt-1">
                {activeLessonIndex > index ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <PlayCircle className={`w-5 h-5 ${activeLessonIndex === index ? 'text-blue-400' : 'text-slate-500'}`} />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1 opacity-70">LECCIÓN {index + 1}</p>
                <p className="font-medium line-clamp-2">{lesson.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto bg-slate-950 text-slate-100">
        <header className="p-4 border-b border-slate-800 flex items-center bg-slate-900/50 sticky top-0 backdrop-blur-md z-10 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg mr-4 transition-colors text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold truncate">{activeLesson ? activeLesson.title : 'Cargando lección...'}</h1>
        </header>

        {activeLesson ? (
          <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
            {activeLesson.videoUrl && (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-8 shadow-2xl border border-slate-800">
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(activeLesson.videoUrl) || ''}
                  title="Reproductor de video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
              <h2 className="text-3xl font-bold mb-6 text-blue-100">{activeLesson.title}</h2>
              <div className="prose prose-invert prose-blue max-w-none">
                {/* En una app real usaríamos react-markdown */}
                {activeLesson.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-slate-300 text-lg leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 pb-12">
              <button 
                disabled={activeLessonIndex === 0}
                onClick={() => setActiveLessonIndex(prev => prev - 1)}
                className="px-6 py-3 bg-slate-800 text-white rounded-lg disabled:opacity-50 hover:bg-slate-700 transition-colors"
              >
                Anterior
              </button>
              
              <button 
                disabled={activeLessonIndex === lessons.length - 1}
                onClick={() => setActiveLessonIndex(prev => prev + 1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-blue-500 transition-colors"
              >
                Siguiente Lección <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <BookOpen className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Aún no hay lecciones</h3>
            <p>El profesor está preparando el contenido para este curso.</p>
          </div>
        )}
      </div>
    </div>
  );
};
