import { useEffect, useState } from 'react';
import { metricsService } from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    metricsService
      .getDashboard()
      .then((data) => {
        if (!mounted) return;
        setMetrics(data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Erro ao carregar métricas');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
      )}

      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Ativos</div>
            <div className="text-3xl font-bold mt-2">{metrics.totalVoluntariosAtivos}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Inativos</div>
            <div className="text-3xl font-bold mt-2">{metrics.totalVoluntariosInativos}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Oficinas</div>
            <div className="text-3xl font-bold mt-2">{metrics.totalOficinas}</div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-slate-700">
            <div className="text-sm text-slate-400">Termos gerados</div>
            <div className="text-3xl font-bold mt-2">{metrics.totalTermosGerados}</div>
          </div>
        </div>
      )}
    </div>
  );
}
