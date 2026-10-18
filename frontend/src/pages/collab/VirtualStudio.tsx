import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collabApi } from '../../api/collabApi';
import type { CollabProject } from '../../api/collabApi';
import { ArrowLeft, Play, Pause, MessageCircle, UploadCloud } from 'lucide-react';

export const VirtualStudio = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<CollabProject | null>(null);

    useEffect(() => {
        if (id) {
            collabApi.getProjectDetails(id).then(setProject);
        }
    }, [id]);

    if (!project) return <div className="p-8 text-white">Cargando estudio...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <header className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/collab" className="text-slate-400 hover:text-white p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold">{project.title}</h1>
                        <p className="text-xs text-slate-400">Estudio Virtual</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded flex items-center gap-2 text-sm">
                        <UploadCloud className="w-4 h-4" /> Subir Stem
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded flex items-center gap-2 text-sm font-semibold">
                        <Play className="w-4 h-4" /> Play All
                    </button>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto">
                {project.stems.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No hay pistas de audio (stems) subidas en este proyecto.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {project.stems.map((stem) => (
                            <div key={stem.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4">
                                <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0 hover:bg-slate-700">
                                    <Play className="w-4 h-4 text-emerald-400" />
                                </button>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="font-medium text-sm">{stem.name}</h3>
                                        <button className="text-slate-400 hover:text-white flex items-center gap-1 text-xs">
                                            <MessageCircle className="w-3 h-3" /> {stem.comments.length}
                                        </button>
                                    </div>
                                    <div className="h-12 bg-slate-800 rounded w-full flex items-center px-4 relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 bg-blue-900/30 w-1/3 border-r border-blue-500"></div>
                                        <span className="relative z-10 text-xs text-slate-500 font-mono">00:00 / 03:45</span>
                                    </div>
                                    <audio src={stem.fileUrl} className="hidden" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
