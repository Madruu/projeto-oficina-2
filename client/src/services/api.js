// Get API URL from env or default to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper para fazer requisições
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  return response.json();
}

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

export default { volunteerService };
