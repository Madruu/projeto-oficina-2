import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Bypass login - redirect directly to volunteers page
  useEffect(() => {
    navigate("/voluntarios", { replace: true });
  }, [navigate]);

  return null;
}

export default Login;

