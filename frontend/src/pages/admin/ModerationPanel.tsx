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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
        Cargando reportes pendientes...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--bh-text-secondary, #a1a1aa)' }}>
        <Check style={{ width: '40px', height: '40px', margin: '0 auto 1rem', color: '#10b981', opacity: 0.8 }} />
        <p style={{ margin: 0, fontSize: '0.95rem' }}>No hay reportes de moderación pendientes.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.08))', color: 'var(--bh-text-secondary, #a1a1aa)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '0.875rem 1.25rem' }}>Tipo</th>
            <th style={{ padding: '0.875rem 1.25rem' }}>Motivo</th>
            <th style={{ padding: '0.875rem 1.25rem' }}>Fecha</th>
            <th style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr 
              key={report.id} 
              style={{
                borderBottom: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.05))',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '1rem 1.25rem', color: '#fff', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b', flexShrink: 0 }} />
                  {report.targetType}
                </div>
              </td>
              <td style={{ padding: '1rem 1.25rem', color: 'var(--bh-text-secondary, #cbd5e1)' }}>{report.reason}</td>
              <td style={{ padding: '1rem 1.25rem', color: 'var(--bh-text-secondary, #a1a1aa)', whiteSpace: 'nowrap' }}>
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleResolve(report.id, 'APPROVED')}
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      borderRadius: '0.5rem',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Aprobar reporte (sancionar contenido)"
                  >
                    <Check style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button 
                    onClick={() => handleResolve(report.id, 'REJECTED')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--bh-border-subtle, rgba(255, 255, 255, 0.1))',
                      color: 'var(--bh-text-secondary, #a1a1aa)',
                      borderRadius: '0.5rem',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Rechazar reporte (descartar)"
                  >
                    <X style={{ width: '16px', height: '16px' }} />
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
