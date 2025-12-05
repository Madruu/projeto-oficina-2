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
  // Lista todos os voluntários
  getAll: () => request("/voluntarios"),

  // Busca um voluntário por ID
  getById: (id) => request(`/voluntarios/${id}`),

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

  // Remove um voluntário
  delete: (id) =>
    request(`/voluntarios/${id}`, {
      method: "DELETE",
    }),
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

export default { authService, volunteerService, workshopService };
