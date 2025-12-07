import { useState, useEffect, useMemo } from "react";
import { workshopService } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import WorkshopForm from "../components/WorkshopForm";

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const { canEdit, canDelete } = useAuth();

  // Fetch workshops
  const fetchWorkshops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workshopService.getAll();
      setWorkshops(data);
    } catch (err) {
      setError(err.message);
      toast.error("Erro ao carregar oficinas: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Filtered workshops
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((workshop) =>
      workshop.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workshop.descricao && workshop.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (workshop.local && workshop.local.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [workshops, searchTerm]);

  // Handle create workshop
  const handleCreate = () => {
    setSelectedWorkshop(null);
    setIsFormModalOpen(true);
  };

  // Handle edit workshop
  const handleEdit = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsFormModalOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedWorkshop) {
        // Update existing
        await workshopService.update(selectedWorkshop._id, data);
        setWorkshops(
          workshops.map((w) =>
            w._id === selectedWorkshop._id ? { ...w, ...data } : w
          )
        );
        toast.success("Oficina atualizada com sucesso!");
      } else {
        // Create new
        const newWorkshop = await workshopService.create(data);
        setWorkshops([newWorkshop, ...workshops]);
        toast.success("Oficina criada com sucesso!");
      }
      setIsFormModalOpen(false);
      setSelectedWorkshop(null);
    } catch (err) {
      toast.error("Erro: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await workshopService.delete(selectedWorkshop._id);
      setWorkshops(workshops.filter((w) => w._id !== selectedWorkshop._id));
      toast.success("Oficina removida com sucesso!");
      setIsDeleteDialogOpen(false);
      setSelectedWorkshop(null);
    } catch (err) {
      toast.error("Erro ao deletar: " + err.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-slate-100">Oficinas</h1>
          {canEdit() && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
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
              Nova Oficina
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-4 top-3 w-5 h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar oficinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin">
              <svg
                className="w-12 h-12 text-cyan-500"
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
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-lg">
            <p className="text-rose-400">Erro: {error}</p>
            <button
              onClick={fetchWorkshops}
              className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-slate-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-slate-400 text-lg">
              {searchTerm
                ? "Nenhuma oficina encontrada com esse termo"
                : "Nenhuma oficina cadastrada"}
            </p>
          </div>
        )}

        {/* Workshops Table */}
        {!isLoading && !error && filteredWorkshops.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Título
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Data
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Local
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Responsável
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkshops.map((workshop) => (
                  <tr
                    key={workshop._id}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-slate-100 font-medium">
                          {workshop.titulo}
                        </p>
                        {workshop.descricao && (
                          <p className="text-slate-500 text-sm truncate">
                            {workshop.descricao}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {formatDate(workshop.data)}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {workshop.local || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-slate-300">
                      {workshop.responsavel || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {canEdit() && (
                          <button
                            onClick={() => handleEdit(workshop)}
                            className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
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
                            onClick={() => handleDeleteClick(workshop)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Deletar"
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
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedWorkshop(null);
        }}
        title={selectedWorkshop ? "Editar Oficina" : "Nova Oficina"}
        size="lg"
      >
        <WorkshopForm
          workshop={selectedWorkshop}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormModalOpen(false);
            setSelectedWorkshop(null);
          }}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedWorkshop(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Deletar Oficina"
        message={`Tem certeza que deseja deletar a oficina "${selectedWorkshop?.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        variant="danger"
      />
    </Layout>
  );
}
