import { useState, useEffect, useMemo } from 'react';
import { volunteerService, workshopService } from '../services/api';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function VolunteerAssignment() {
  const [volunteers, setVolunteers] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [selectedWorkshops, setSelectedWorkshops] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [volunteerHistory, setVolunteerHistory] = useState([]);

  const toast = useToast();

  // Fetch volunteers and workshops
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [volunteersList, workshopsList] = await Promise.all([
          volunteerService.getAll(),
          workshopService.getAll(),
        ]);
        setVolunteers(volunteersList);
        setWorkshops(workshopsList);
      } catch (err) {
        setError(err.message);
        toast.error('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Load volunteer history when selected
  useEffect(() => {
    if (selectedVolunteer) {
      // Usa o array de associações se disponível, caso contrário usa officinaId
      let historyData = [];
      
      if (selectedVolunteer.associacoes && selectedVolunteer.associacoes.length > 0) {
        // Mapeando associações com possibilidade de ser objeto ou ID
        historyData = selectedVolunteer.associacoes
          .map((assoc) => {
            // Se oficinaId é um objeto (já populado)
            if (assoc.oficinaId && typeof assoc.oficinaId === 'object') {
              return {
                ...assoc.oficinaId,
                dataAssociacao: assoc.dataAssociacao
              };
            }
            // Se officinaId é apenas um ID string, procura nos workshops
            const workshop = workshops.find((w) => w._id === assoc.oficinaId);
            return workshop ? { ...workshop, dataAssociacao: assoc.dataAssociacao } : null;
          })
          .filter(Boolean);
      } else if (selectedVolunteer.officinaId && selectedVolunteer.officinaId.length > 0) {
        // Fallback para officinaId se associacoes não existir
        historyData = selectedVolunteer.officinaId
          .map((officinaId) => {
            const workshop = workshops.find((w) => w._id === officinaId);
            return workshop;
          })
          .filter(Boolean);
      }
      
      setVolunteerHistory(historyData);
    } else {
      setVolunteerHistory([]);
    }
  }, [selectedVolunteer, workshops]);

  // Filter volunteers by search term
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) =>
      v.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cpf?.includes(searchTerm) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [volunteers, searchTerm]);

  // Handle volunteer selection
  const handleSelectVolunteer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setSelectedWorkshops(new Set());
  };

  // Handle workshop toggle
  const handleWorkshopToggle = (workshopId) => {
    const newSet = new Set(selectedWorkshops);
    if (newSet.has(workshopId)) {
      newSet.delete(workshopId);
    } else {
      newSet.add(workshopId);
    }
    setSelectedWorkshops(newSet);
  };

  // Handle assignment
  const handleAssignWorkshops = async () => {
    if (!selectedVolunteer) {
      toast.error('Selecione um voluntário');
      return;
    }

    if (selectedWorkshops.size === 0) {
      toast.error('Selecione pelo menos uma oficina');
      return;
    }

    setShowConfirm(true);
  };

  // Confirm assignment
  const handleConfirmAssignment = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);

    try {
      let successCount = 0;
      const errors = [];

      // Assign each workshop individually
      for (const workshopId of selectedWorkshops) {
        try {
          // Check if already assigned
          if (!selectedVolunteer.oficinaId?.includes(workshopId)) {
            await volunteerService.assign(selectedVolunteer._id, workshopId);
            successCount++;
          } 
        } catch (err) {
          errors.push(err.message);
        }
      }

      // Monta mensagem de resultado
      if (successCount > 0) {
        let message = `${successCount} oficina(s) associada(s) com sucesso!`;
        
        toast.success(message);
      }

      if (errors.length > 0) {
        errors.forEach(err => toast.error(`Erro: ${err}`));
      }

      // Refresh volunteer data to show new associations
      const updated = await volunteerService.getById(selectedVolunteer._id);
      setSelectedVolunteer(updated);
      setSelectedWorkshops(new Set());
    } catch (err) {
      toast.error(`Erro ao associar oficinas: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-slate-300">Carregando dados...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">Associar Voluntários a Oficinas</h1>
        <p className="text-slate-400 mb-8">
          Selecione um voluntário e escolha uma ou mais oficinas para associá-lo
        </p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Volunteer Selection */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Selecionar Voluntário</h2>

            {/* Search input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition text-slate-100 placeholder-slate-500"
              />
            </div>

            {/* Volunteers list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredVolunteers.length === 0 ? (
                <div className="text-slate-400 py-8 text-center">Nenhum voluntário encontrado</div>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <button
                    key={volunteer._id}
                    onClick={() => handleSelectVolunteer(volunteer)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedVolunteer?._id === volunteer._id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-medium">{volunteer.nomeCompleto}</div>
                    {volunteer.email && (
                      <div className="text-sm text-slate-400">{volunteer.email}</div>
                    )}
                    {volunteer.ativo ? (
                      <div className="text-xs text-green-400">● Ativo</div>
                    ) : (
                      <div className="text-xs text-rose-400">● Inativo</div>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Selected volunteer info */}
            {selectedVolunteer && (
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <h3 className="font-semibold text-slate-100 mb-2">Voluntário Selecionado</h3>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">Nome: </span>
                    {selectedVolunteer.nomeCompleto}
                  </div>
                  {selectedVolunteer.email && (
                    <div>
                      <span className="text-slate-400">Email: </span>
                      {selectedVolunteer.email}
                    </div>
                  )}
                  {selectedVolunteer.telefone && (
                    <div>
                      <span className="text-slate-400">Telefone: </span>
                      {selectedVolunteer.telefone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Workshop Selection */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Selecionar Oficinas ({selectedWorkshops.size})
            </h2>

            {/* Workshops list */}
            <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
              {workshops.length === 0 ? (
                <div className="text-slate-400 py-8 text-center">Nenhuma oficina disponível</div>
              ) : (
                workshops.map((workshop) => {
                  const isAlreadyAssigned = selectedVolunteer?.oficinaId?.includes(workshop._id);
                  const isSelected = selectedWorkshops.has(workshop._id);

                  return (
                    <label
                      key={workshop._id}
                      className={`flex items-start p-4 rounded-lg border cursor-pointer transition ${
                        isAlreadyAssigned
                          ? 'bg-slate-700/20 border-slate-600 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-cyan-600/20 border-cyan-500'
                          : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isAlreadyAssigned && handleWorkshopToggle(workshop._id)}
                        disabled={isAlreadyAssigned}
                        className="mt-1 w-4 h-4 accent-cyan-500 cursor-pointer"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-slate-100">{workshop.titulo}</div>
                        {workshop.descricao && (
                          <div className="text-sm text-slate-400 mt-1">{workshop.descricao}</div>
                        )}
                        <div className="text-xs text-slate-500 mt-2 space-y-1">
                          {workshop.data && (
                            <div>📅 {formatDate(workshop.data)}</div>
                          )}
                          {workshop.local && (
                            <div>📍 {workshop.local}</div>
                          )}
                          {workshop.responsavel && (
                            <div>👤 {workshop.responsavel}</div>
                          )}
                        </div>
                        {isAlreadyAssigned && (
                          <div className="text-xs text-green-400 mt-2">✓ Já associada</div>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* Action buttons */}
            {selectedVolunteer && (
              <button
                onClick={handleAssignWorkshops}
                disabled={selectedWorkshops.size === 0 || isSubmitting}
                className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
              >
                {isSubmitting ? 'Associando...' : `Associar ${selectedWorkshops.size} Oficina(s)`}
              </button>
            )}
          </div>
        </div>

        {/* History section */}
        {selectedVolunteer && volunteerHistory.length > 0 && (
          <div className="mt-8 bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-100">
                Histórico de Associações
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {selectedVolunteer.nomeCompleto} - {volunteerHistory.length} oficina(s) associada(s)
              </p>
            </div>

            {/* Table view for larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Oficina</th>
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Data da Oficina</th>
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Local</th>
                    <th className="text-left px-4 py-3 text-slate-300 font-semibold">Data da Associação</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteerHistory.map((workshop) => (
                    <tr key={workshop._id} className="border-b border-slate-700 hover:bg-slate-700/20 transition">
                      <td className="px-4 py-3 text-slate-200 font-medium">{workshop.titulo}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {workshop.data ? formatDate(workshop.data) : '-'}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {workshop.local || '-'}
                      </td>
                      <td className="px-4 py-3 text-green-400">
                        {workshop.dataAssociacao ? formatDateTime(workshop.dataAssociacao) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grid view for smaller screens */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {volunteerHistory.map((workshop) => (
                <div key={workshop._id} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-100 text-lg">{workshop.titulo}</h3>
                    {workshop.descricao && (
                      <p className="text-sm text-slate-400 mt-1">{workshop.descricao}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {workshop.data && (
                      <div className="bg-slate-800/50 p-2 rounded">
                        <div className="text-slate-500">Oficina em</div>
                        <div className="text-slate-300 font-medium">📅 {formatDate(workshop.data)}</div>
                      </div>
                    )}
                    {workshop.local && (
                      <div className="bg-slate-800/50 p-2 rounded">
                        <div className="text-slate-500">Local</div>
                        <div className="text-slate-300 font-medium">📍 {workshop.local}</div>
                      </div>
                    )}
                    {workshop.dataAssociacao && (
                      <div className="col-span-2 bg-green-600/20 p-2 rounded border border-green-600/30">
                        <div className="text-green-400 text-xs">Associado em</div>
                        <div className="text-green-300 font-medium">{formatDateTime(workshop.dataAssociacao)}</div>
                      </div>
                    )}
                  </div>
                  {workshop.responsavel && (
                    <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-500">
                      👤 Responsável: {workshop.responsavel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {selectedVolunteer && volunteerHistory.length === 0 && (
          <div className="mt-8 bg-slate-800/50 rounded-lg p-6 border border-slate-700 text-center text-slate-400">
            Nenhuma oficina associada a este voluntário
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Confirmar Associação"
        message={`Deseja associar ${selectedWorkshops.size} oficina(s) a ${selectedVolunteer?.nomeCompleto}?`}
        confirmText="Associar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAssignment}
        onClose={() => setShowConfirm(false)}
        isLoading={isSubmitting}
      />
    </Layout>
  );
}
