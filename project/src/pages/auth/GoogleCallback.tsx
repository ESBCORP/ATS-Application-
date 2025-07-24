// src/pages/auth/GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    //console.log("✅ Google OAuth code:", code);
    if (code) {
      loginWithGoogle(code)
        .then(() => navigate("/dashboard"))
        .catch((err) => {
        let message =
          err?.response?.data?.detail || "Google login failed. Please try again.";
          if (message.includes("not registered")) {
    message = "User is not registered.";
  }

        navigate("/login", { state: { googleError: message } });
      });
  } else {
    alert("No code found in URL");
    navigate("/login");
  }
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Logging in with Google...</h1>
        <p>Please wait a moment.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
