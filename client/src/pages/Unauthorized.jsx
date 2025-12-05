import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 mb-6">
          <svg
            className="w-10 h-10 text-rose-500"
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

        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Acesso Negado
        </h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Você não tem permissão para acessar esta página.
          {user && (
            <span className="block mt-2 text-sm">
              Seu perfil atual: <span className="text-cyan-400 font-medium">{user.role}</span>
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/voluntarios"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Voltar ao Início
          </Link>
          <button
            onClick={logout}
            className="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-all"
          >
            Fazer Logout
          </button>
        </div>
      </div>
    </div>
  );
}

