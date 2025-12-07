import { useState, useEffect } from "react";
import { volunteerService } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function VolunteerHistory({ volunteerId, onClose }) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await volunteerService.getHistory(volunteerId);
        setHistory(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erro ao carregar histórico: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (volunteerId) {
      fetchHistory();
    }
  }, [volunteerId, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin w-10 h-10 text-cyan-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-slate-400">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-slate-300 font-medium">Erro ao carregar histórico</p>
            <p className="text-slate-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Informações do Voluntário */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          Informações do Voluntário
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Nome Completo</p>
            <p className="text-slate-100 font-medium">{history.voluntario.nomeCompleto}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Status</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                history.voluntario.ativo
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
              }`}
            >
              {history.voluntario.ativo ? "Ativo" : "Inativo"}
            </span>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Data de Entrada</p>
            <p className="text-slate-100">{formatDate(history.voluntario.dataEntrada)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Data de Saída</p>
            <p className="text-slate-100">
              {history.voluntario.dataSaida
                ? formatDate(history.voluntario.dataSaida)
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Histórico de Oficinas */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">
              Histórico de Participação em Oficinas
            </h3>
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/20">
              {history.totalOficinas} {history.totalOficinas === 1 ? "oficina" : "oficinas"}
            </span>
          </div>
        </div>

        {history.oficinas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-slate-300 font-medium mb-2">
              Nenhuma oficina registrada
            </p>
            <p className="text-slate-500 text-sm">
              Este voluntário ainda não participou de nenhuma oficina.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {history.oficinas.map((oficina, index) => (
              <div
                key={oficina.id}
                className="p-6 hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-slate-100 font-semibold text-lg">
                          {oficina.titulo}
                        </h4>
                        {oficina.descricao && (
                          <p className="text-slate-400 text-sm mt-1">
                            {oficina.descricao}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 ml-13">
                      {oficina.data && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Data da Oficina</p>
                          <p className="text-slate-300 text-sm">
                            {formatDate(oficina.data)}
                          </p>
                        </div>
                      )}
                      {oficina.local && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Local</p>
                          <p className="text-slate-300 text-sm">{oficina.local}</p>
                        </div>
                      )}
                      {oficina.responsavel && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Responsável</p>
                          <p className="text-slate-300 text-sm">
                            {oficina.responsavel}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
