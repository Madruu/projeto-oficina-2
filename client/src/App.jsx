import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";
import Login from "./pages/Login";
import Volunteers from "./pages/Volunteers";

function App() {
  return (
    <ToastProvider>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/voluntarios" element={<Volunteers />} />
        <Route path="/" element={<Navigate to="/voluntarios" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
