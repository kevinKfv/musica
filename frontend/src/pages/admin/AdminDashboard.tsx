import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Music, Activity, ShieldAlert } from 'lucide-react';
import { ModerationPanel } from './ModerationPanel';

export const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getAnalytics()
            .then(setAnalytics)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
                        <ShieldAlert className="w-8 h-8" />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2">Métricas globales y moderación de contenido.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MetricCard title="Usuarios Activos" value={analytics.activeUsers} icon={<Users className="w-8 h-8 text-blue-400" />} loading={loading} />
                    <MetricCard title="Total Bandas" value={analytics.totalBands} icon={<Music className="w-8 h-8 text-purple-400" />} loading={loading} />
                    <MetricCard title="Proyectos Collab" value={analytics.totalCollabProjects} icon={<Activity className="w-8 h-8 text-emerald-400" />} loading={loading} />
                    <MetricCard title="Reportes Pendientes" value={analytics.pendingReports} icon={<ShieldAlert className="w-8 h-8 text-red-400" />} loading={loading} />
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Moderación de Contenido</h2>
                    <ModerationPanel />
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, icon, loading }: { title: string, value?: number, icon: React.ReactNode, loading: boolean }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
        <div>
            <p className="text-slate-400 text-sm mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{loading ? '...' : value ?? 0}</h3>
        </div>
        <div className="bg-slate-800 p-3 rounded-xl">
            {icon}
        </div>
    </div>
);
