import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";

const roleLabels = {
  admin: "Administrador",
  coordenador: "Coordenador",
  visitante: "Visitante",
};

const roleBadgeStyles = {
  admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  coordenador: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  visitante: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items com controle de visibilidade por role
  const navItems = [
    {
      path: "/voluntarios",
      label: "Voluntários",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE],
    },
    {
      path: "/oficinas",
      label: "Oficinas",
      icon: (
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE],
    },
    {
      path: "/associações",
      label: "Associações",
      icon: (
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
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      roles: [ROLES.ADMIN, ROLES.COORDENADOR],
    },
    {
      path: "/usuarios",
      label: "Usuários",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      roles: [ROLES.ADMIN], // Apenas admin
    },
  ];

  // Filtra items baseado na role do usuário
  const visibleNavItems = navItems.filter(
    (item) => !item.roles || hasRole(...item.roles)
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              ELLP
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ensino Lúdico de Lógica e Programação
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-700">
            {user && (
              <div className="mb-4 px-4 py-3 bg-slate-700/30 rounded-lg">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user.nome}
                </p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full border ${
                    roleBadgeStyles[user.role] || roleBadgeStyles.visitante
                  }`}
                >
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 rounded-lg transition-all duration-200"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
