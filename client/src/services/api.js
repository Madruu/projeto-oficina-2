// Get API URL from env or default to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "ellp_token";

// Helper para fazer requisições
async function request(endpoint, options = {}) {
  const token = options.token || localStorage.getItem(TOKEN_KEY);

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Remove custom properties
  delete config.token;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 401 - Token expired or invalid
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("ellp_user");
    // Redirect to login if not already there
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  return response.json();
}

// Serviço de Autenticação
export const authService = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMe: (token) =>
    request("/auth/me", {
      token,
    }),

  updateMe: (data) =>
    request("/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Serviço de Voluntários
export const volunteerService = {
  // Lista todos os voluntários com filtros opcionais
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.nome) params.append('nome', filters.nome);
    if (filters.cpf) params.append('cpf', filters.cpf);
    if (filters.oficina) params.append('oficina', filters.oficina);
    
    const queryString = params.toString();
    return request(`/voluntarios${queryString ? `?${queryString}` : ''}`);
  },

  // Busca um voluntário por ID
  getById: (id) => request(`/voluntarios/${id}`),

  // Busca o histórico completo de participação do voluntário
  getHistory: (id) => request(`/voluntarios/${id}/history`),

  // Cria um novo voluntário
  create: (data) =>
    request("/voluntarios", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Atualiza um voluntário
  update: (id, data) =>
    request(`/voluntarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Associa uma oficina a um voluntário
  assign: (id, workshopId) =>
    request(`/voluntarios/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ oficinaId: workshopId }),
    }),

  // Remove um voluntário
  delete: (id) =>
    request(`/voluntarios/${id}`, {
      method: "DELETE",
    }),

  // Gera e baixa PDF do voluntário
  downloadPDF: async (id) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    
    const response = await fetch(`${API_BASE_URL}/voluntarios/${id}/pdf`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("ellp_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Não autorizado");
    }

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro ao gerar PDF" }));
      throw new Error(error.error || `Erro ${response.status}`);
    }

    // Obtém o blob do PDF
    const blob = await response.blob();
    
    // Cria um link temporário para download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    // Extrai o nome do arquivo do header Content-Disposition ou usa um padrão
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `termo-voluntariado-${id}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// Serviço de Oficinas
export const workshopService = {
  getAll: () => request("/oficinas"),
  getById: (id) => request(`/oficinas/${id}`),
  create: (data) =>
    request("/oficinas", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/oficinas/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/oficinas/${id}`, {
      method: "DELETE",
    }),
};

// Serviço de métricas / dashboard
export const metricsService = {
  getDashboard: () => request('/metrics/dashboard'),
};

export default { authService, volunteerService, workshopService, metricsService };
