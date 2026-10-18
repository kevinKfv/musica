import React, { useState } from 'react';
import { academyApi } from '../../api/academyApi';
import { useNavigate } from 'react-router-dom';

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0
  });
  const [lessons, setLessons] = useState([{ title: '', content: '', videoUrl: '' }]);
  const [loading, setLoading] = useState(false);

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '', content: '', videoUrl: '' }]);
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
        price: formData.price
      });

      for (let i = 0; i < lessons.length; i++) {
        await academyApi.addLesson(course.id, {
          ...lessons[i],
          orderIndex: i
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl mt-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-6">
          Crear Nuevo Curso
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4 text-blue-300">Datos Generales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-slate-300 mb-2 font-medium">Título del Curso</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-slate-300 mb-2 font-medium">Precio (USD)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-300 mb-2 font-medium">Descripción</label>
                <textarea 
                  required rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
              <h3 className="text-xl font-bold text-blue-300">Temario (Lecciones)</h3>
              <button 
                type="button" onClick={handleAddLesson}
                className="text-sm px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-blue-300"
              >
                + Agregar Lección
              </button>
            </div>
            
            <div className="space-y-6">
              {lessons.map((lesson, index) => (
                <div key={index} className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-slate-400 mb-4">Lección {index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-slate-400 mb-1 text-sm">Título de la Lección</label>
                      <input 
                        type="text" required
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        value={lesson.title} onChange={e => handleLessonChange(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-slate-400 mb-1 text-sm">URL del Video (opcional)</label>
                      <input 
                        type="url" placeholder="https://youtube.com/..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        value={lesson.videoUrl} onChange={e => handleLessonChange(index, 'videoUrl', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-400 mb-1 text-sm">Contenido (Texto)</label>
                      <textarea 
                        required rows={3}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        value={lesson.content} onChange={e => handleLessonChange(index, 'content', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button" onClick={() => navigate('/academy')}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Crear Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
