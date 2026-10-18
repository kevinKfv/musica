import { useEffect, useState } from 'react';
import { adminApi, ModerationReport } from '../../api/adminApi';
import { Check, X, AlertTriangle } from 'lucide-react';

export const ModerationPanel = () => {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        setLoading(true);
        adminApi.getPendingReports()
            .then(setReports)
            .finally(() => setLoading(false));
    };

    const handleResolve = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await adminApi.resolveReport(id, { status, resolutionNotes: 'Resolved via Panel' });
            setReports(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            console.error("Error resolving report", e);
        }
    };

    if (loading) return <div className="text-slate-500 py-8 text-center">Cargando reportes...</div>;

    if (reports.length === 0) return (
        <div className="text-center py-12 text-slate-500">
            <Check className="w-12 h-12 mx-auto mb-4 text-emerald-500/50" />
            <p>No hay reportes pendientes.</p>
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="text-xs text-slate-500 uppercase bg-slate-800/50">
                    <tr>
                        <th className="px-6 py-3 rounded-tl-lg">Tipo</th>
                        <th className="px-6 py-3">Motivo</th>
                        <th className="px-6 py-3">Fecha</th>
                        <th className="px-6 py-3 rounded-tr-lg text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id} className="border-b border-slate-800 hover:bg-slate-800/20">
                            <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                {report.targetType}
                            </td>
                            <td className="px-6 py-4">{report.reason}</td>
                            <td className="px-6 py-4">{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleResolve(report.id, 'APPROVED')}
                                        className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded transition" 
                                        title="Aprobar Reporte (Sancionar)"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleResolve(report.id, 'REJECTED')}
                                        className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded transition" 
                                        title="Rechazar Reporte (Ignorar)"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
