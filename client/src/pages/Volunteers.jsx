import { useState, useEffect, useMemo, useCallback } from "react";
import { volunteerService, workshopService } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import VolunteerForm from "../components/VolunteerForm";
import VolunteerHistory from "../components/VolunteerHistory";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nomeFilter, setNomeFilter] = useState("");
  const [cpfFilter, setCpfFilter] = useState("");
  const [oficinaFilter, setOficinaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(null); // ID do voluntário que está gerando PDF

  const toast = useToast();
  const { canEdit, canDelete } = useAuth();

  // Fetch workshops for filter dropdown
  const fetchWorkshops = async () => {
    try {
      const data = await workshopService.getAll();
      setWorkshops(data);
    } catch (err) {
      console.error("Erro ao carregar oficinas:", err);
    }
  };

  // Fetch volunteers with current filters
  const fetchVolunteers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {};
      if (nomeFilter.trim()) filters.nome = nomeFilter.trim();
      if (cpfFilter.trim()) filters.cpf = cpfFilter.trim();
      if (oficinaFilter) filters.oficina = oficinaFilter;

      const data = await volunteerService.getAll(filters);
      setVolunteers(data);
    } catch (err) {
      setError(err.message);
      toast.error("Erro ao carregar voluntários: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [nomeFilter, cpfFilter, oficinaFilter, toast]);

  useEffect(() => {
    fetchWorkshops();
    // Initial load without filters
    setIsLoading(true);
    volunteerService.getAll({})
      .then((data) => {
        setVolunteers(data);
      })
      .catch((err) => {
        setError(err.message);
        toast.error("Erro ao carregar voluntários: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toast]);

  // Debounce effect for search - triggers when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVolunteers();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchVolunteers]);

  // Filtered volunteers (only by status, since other filters are server-side)
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && v.ativo) ||
        (statusFilter === "inactive" && !v.ativo);

      return matchesStatus;
    });
  }, [volunteers, statusFilter]);

  // Handle create volunteer
  const handleCreate = () => {
    setSelectedVolunteer(null);
    setIsFormModalOpen(true);
  };

  // Handle edit volunteer
  const handleEdit = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsFormModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDeleteDialogOpen(true);
  };

  // Handle history click
  const handleHistoryClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsHistoryModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedVolunteer) {
        await volunteerService.update(selectedVolunteer._id, data);
        toast.success("Voluntário atualizado com sucesso!");
      } else {
        await volunteerService.create(data);
        toast.success("Voluntário cadastrado com sucesso!");
      }
      setIsFormModalOpen(false);
      fetchVolunteers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedVolunteer) return;
    setIsSubmitting(true);
    try {
      await volunteerService.delete(selectedVolunteer._id);
      toast.success("Voluntário removido com sucesso!");
      setIsDeleteDialogOpen(false);
      fetchVolunteers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async (volunteerId) => {
    setDownloadingPDF(volunteerId);
    try {
      await volunteerService.downloadPDF(volunteerId);
      toast.success("PDF gerado e baixado com sucesso!");
    } catch (err) {
      toast.error("Erro ao gerar PDF: " + err.message);
    } finally {
      setDownloadingPDF(null);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Voluntários</h1>
        <p className="text-slate-400">
          Gerencie os voluntários cadastrados no sistema
        </p>
      </div>

      {/* Actions bar */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and filters */}
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            {/* Nome filter */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={nomeFilter}
                onChange={(e) => setNomeFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* CPF filter */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por CPF..."
                value={cpfFilter}
                onChange={(e) => setCpfFilter(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Oficina filter */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
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
              <select
                value={oficinaFilter}
                onChange={(e) => setOficinaFilter(e.target.value)}
                className="pl-10 pr-10 py-2.5 w-full bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition cursor-pointer appearance-none"
              >
                <option value="">Todas as oficinas</option>
                {workshops.map((workshop) => (
                  <option key={workshop._id} value={workshop._id}>
                    {workshop.titulo}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition cursor-pointer appearance-none"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Clear filters button */}
          {(nomeFilter || cpfFilter || oficinaFilter) && (
            <button
              onClick={() => {
                setNomeFilter("");
                setCpfFilter("");
                setOficinaFilter("");
              }}
              className="self-start px-4 py-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Add button row */}
        <div className="flex justify-end mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                try {
                  setDownloadingCSV(true);
                  await volunteerService.exportAll();
                  toast.success('CSV exportado com sucesso!');
                } catch (err) {
                  toast.error('Erro ao exportar CSV: ' + err.message);
                } finally {
                  setDownloadingCSV(false);
                }
              }}
              className="flex items-center gap-2 px-3 py-2.5 bg-slate-700/50 text-slate-100 rounded-lg hover:bg-slate-700/60 transition"
              title="Exportar CSV"
            >
              {downloadingCSV ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              <span className="text-sm">Exportar CSV</span>
            </button>

            {canEdit() && (
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg shadow-cyan-500/25"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Voluntário
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
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
            <p className="text-slate-400">Carregando voluntários...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
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
              <p className="text-slate-300 font-medium">
                Erro ao carregar voluntários
              </p>
              <p className="text-slate-500 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchVolunteers}
              className="px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-slate-300 font-medium">
                {(nomeFilter || cpfFilter || oficinaFilter || statusFilter !== "all")
                  ? "Nenhum voluntário encontrado"
                  : "Nenhum voluntário cadastrado"}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {(nomeFilter || cpfFilter || oficinaFilter || statusFilter !== "all")
                  ? "Tente ajustar os filtros de busca"
                  : canEdit()
                  ? 'Clique em "Novo Voluntário" para começar'
                  : "Aguarde um administrador cadastrar voluntários"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredVolunteers.map((volunteer) => (
                  <tr
                    key={volunteer._id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                          {volunteer.nomeCompleto?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-100">
                            {volunteer.nomeCompleto}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {volunteer.email && (
                          <p className="text-sm text-slate-300">
                            {volunteer.email}
                          </p>
                        )}
                        {volunteer.telefone && (
                          <p className="text-sm text-slate-500">
                            {volunteer.telefone}
                          </p>
                        )}
                        {!volunteer.email && !volunteer.telefone && (
                          <p className="text-sm text-slate-500">-</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {volunteer.cpf || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300">
                        {formatDate(volunteer.dataEntrada)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          volunteer.ativo
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {volunteer.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botão Histórico - disponível para todos os usuários autenticados */}
                        <button
                          onClick={() => handleHistoryClick(volunteer)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Ver Histórico"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                        {/* Botão Gerar PDF - disponível para todos os usuários autenticados */}
                        <button
                          onClick={() => handleDownloadPDF(volunteer._id)}
                          disabled={downloadingPDF === volunteer._id}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Gerar PDF"
                        >
                          {downloadingPDF === volunteer._id ? (
                            <svg
                              className="w-5 h-5 animate-spin"
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
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          )}
                        </button>
                        {canEdit() && (
                          <button
                            onClick={() => handleEdit(volunteer)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => handleDeleteClick(volunteer)}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with count */}
          <div className="px-6 py-3 border-t border-slate-700 bg-slate-800/50">
            <p className="text-sm text-slate-500">
              Mostrando {filteredVolunteers.length} de {volunteers.length}{" "}
              voluntários
            </p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedVolunteer ? "Editar Voluntário" : "Novo Voluntário"}
        size="md"
      >
        <VolunteerForm
          volunteer={selectedVolunteer}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Voluntário"
        message={`Tem certeza que deseja excluir o voluntário "${selectedVolunteer?.nomeCompleto}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        isLoading={isSubmitting}
      />

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedVolunteer(null);
        }}
        title={`Histórico - ${selectedVolunteer?.nomeCompleto || ""}`}
        size="lg"
      >
        <VolunteerHistory
          volunteerId={selectedVolunteer?._id}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setSelectedVolunteer(null);
          }}
        />
      </Modal>
    </Layout>
  );
}
