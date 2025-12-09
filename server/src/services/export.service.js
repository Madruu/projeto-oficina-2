import Voluntario from '../models/voluntario.model.js';
import Oficina from '../models/oficina.model.js';

// Escape CSV value and wrap in quotes if necessary
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains quote, newline or comma, wrap in quotes and escape quotes
  if (/[",\n\r,]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Gera CSV com a lista completa de voluntários
 * Retorna string CSV (UTF-8 BOM prefixado)
 */
export async function generateVolunteersCSV() {
  const volunteers = await Voluntario.find({}).populate('oficinaId', 'titulo').lean();

  const headers = [
    'Nome',
    'CPF',
    'Email',
    'Telefone',
    'Endereço',
    'DataEntrada',
    'DataSaida',
    'Ativo',
    'Oficinas',
    'CriadoEm',
    'AtualizadoEm'
  ];

  const lines = [];
  // UTF-8 BOM para compatibilidade com Excel
  lines.push('\uFEFF' + headers.join(','));

  for (const v of volunteers) {
    const oficinas = (v.oficinaId || []).map((o) => o.titulo).join(' | ');
    const row = [
      escapeCsv(v.nomeCompleto),
      escapeCsv(v.cpf || ''),
      escapeCsv(v.email || ''),
      escapeCsv(v.telefone || ''),
      escapeCsv(v.endereco || ''),
      escapeCsv(v.dataEntrada ? new Date(v.dataEntrada).toISOString() : ''),
      escapeCsv(v.dataSaida ? new Date(v.dataSaida).toISOString() : ''),
      escapeCsv(v.ativo ? 'Sim' : 'Não'),
      escapeCsv(oficinas),
      escapeCsv(v.createdAt ? new Date(v.createdAt).toISOString() : ''),
      escapeCsv(v.updatedAt ? new Date(v.updatedAt).toISOString() : ''),
    ];
    lines.push(row.join(','));
  }

  return lines.join('\r\n');
}

/**
 * Gera CSV com o histórico detalhado de um voluntário
 * Cada linha representa uma associação a uma oficina (ou um registro geral se não houver oficinas)
 */
export async function generateVolunteerHistoryCSV(volunteerId) {
  const v = await Voluntario.findById(volunteerId)
    .populate('associacoes.oficinaId', 'titulo descricao data local responsavel')
    .lean();

  if (!v) throw new Error('Voluntário não encontrado');

  const headers = [
    'Nome',
    'CPF',
    'Email',
    'Telefone',
    'Ativo',
    'DataEntrada',
    'DataSaida',
    'OficinaTitulo',
    'OficinaData',
    'OficinaLocal',
    'OficinaResponsavel',
    'DataAssociacao'
  ];

  const lines = [];
  lines.push('\uFEFF' + headers.join(','));

  if (Array.isArray(v.associacoes) && v.associacoes.length > 0) {
    for (const assoc of v.associacoes) {
      const oficina = assoc.oficinaId || {};
      const row = [
        escapeCsv(v.nomeCompleto),
        escapeCsv(v.cpf || ''),
        escapeCsv(v.email || ''),
        escapeCsv(v.telefone || ''),
        escapeCsv(v.ativo ? 'Sim' : 'Não'),
        escapeCsv(v.dataEntrada ? new Date(v.dataEntrada).toISOString() : ''),
        escapeCsv(v.dataSaida ? new Date(v.dataSaida).toISOString() : ''),
        escapeCsv(oficina.titulo || ''),
        escapeCsv(oficina.data ? new Date(oficina.data).toISOString() : ''),
        escapeCsv(oficina.local || ''),
        escapeCsv(oficina.responsavel || ''),
        escapeCsv(assoc.dataAssociacao ? new Date(assoc.dataAssociacao).toISOString() : ''),
      ];
      lines.push(row.join(','));
    }
  } else {
    // Sem associacoes: apenas uma linha com dados do voluntário
    const row = [
      escapeCsv(v.nomeCompleto),
      escapeCsv(v.cpf || ''),
      escapeCsv(v.email || ''),
      escapeCsv(v.telefone || ''),
      escapeCsv(v.ativo ? 'Sim' : 'Não'),
      escapeCsv(v.dataEntrada ? new Date(v.dataEntrada).toISOString() : ''),
      escapeCsv(v.dataSaida ? new Date(v.dataSaida).toISOString() : ''),
      '', '', '', '', ''
    ];
    lines.push(row.join(','));
  }

  return lines.join('\r\n');
}
