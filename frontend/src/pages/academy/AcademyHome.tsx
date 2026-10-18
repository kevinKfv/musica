import React, { useState, useEffect } from 'react';
import { academyApi, Course } from '../../api/academyApi';
import { useNavigate } from 'react-router-dom';
import { BookOpen, DollarSign } from 'lucide-react';

export const AcademyHome = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await academyApi.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
              Academia Musical
            </h1>
            <p className="text-slate-400 text-lg">Aprende nuevas habilidades con nuestros cursos interactivos.</p>
          </div>
          <div>
            <button 
              onClick={() => navigate('/academy/create')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              Publicar Curso (Profesor)
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">
              No hay cursos disponibles por el momento. Sé el primero en crear uno.
            </div>
          ) : (
            courses.map(course => (
              <div 
                key={course.id}
                onClick={() => navigate(`/academy/${course.id}`)}
                className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all cursor-pointer hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] flex flex-col"
              >
                <div className="h-48 bg-slate-700 bg-[url('https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 line-clamp-3 mb-6 flex-grow">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <div className="flex items-center text-blue-400 font-bold text-xl">
                      <DollarSign className="w-5 h-5" />
                      {course.price}
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Ver Curso
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
