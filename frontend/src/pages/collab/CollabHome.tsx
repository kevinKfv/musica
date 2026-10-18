import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collabApi } from '../../api/collabApi';
import type { CollabProject } from '../../api/collabApi';
import { PlusCircle, Music, Folder } from 'lucide-react';

export const CollabHome = () => {
    const [projects, setProjects] = useState<CollabProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        collabApi.getProjects()
            .then(setProjects)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Estudio Colaborativo</h1>
                        <p className="text-slate-400 mt-2">Gestiona tus proyectos multipista y colabora con otros músicos.</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" />
                        Nuevo Proyecto
                    </button>
                </header>

                {loading ? (
                    <div className="text-center text-slate-500 py-12">Cargando proyectos...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center bg-slate-900 rounded-xl p-12 border border-slate-800">
                        <Folder className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <h2 className="text-xl font-semibold mb-2">No tienes proyectos</h2>
                        <p className="text-slate-400">Crea tu primer proyecto para empezar a colaborar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <Link 
                                to={`/collab/${project.id}`} 
                                key={project.id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition block group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-slate-800 p-3 rounded-lg group-hover:bg-blue-600/20 transition">
                                        <Music className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                                    </div>
                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{project.status}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 truncate">{project.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2">{project.description}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
