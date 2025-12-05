import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Volunteers from "./pages/Volunteers";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Toast />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Private routes */}
          <Route
            path="/voluntarios"
            element={
              <PrivateRoute>
                <Volunteers />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/voluntarios" replace />} />
          <Route path="*" element={<Navigate to="/voluntarios" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
