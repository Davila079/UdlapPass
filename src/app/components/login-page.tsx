import React, { useState } from "react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";

export function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedId = userId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setError("Por favor ingresa tu ID y contraseña");
      return;
    }

    setLoading(true);
    try {
      const success = await login(trimmedId, trimmedPassword);
      if (success) {
        navigate("/home");
      } else {
        setError("ID o contraseña incorrectos");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] flex flex-col items-center px-6">
      <p className="font-['Lexend',sans-serif] font-bold text-[#f48a32] text-[20px] tracking-[-0.5px] mt-6">
        UDLAP
      </p>

      <h1 className="font-['DM_Serif_Text',serif] text-[28px] text-black mb-6">
        Iniciar Sesion
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="font-['DM_Serif_Text',serif] text-[18px] text-black block mb-1">
            Usuario / ID
          </label>
          <input
            data-cy="usuario"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID Estudiante"
            disabled={loading}
            className="w-full h-[50px] bg-white px-4 font-['DM_Serif_Text',serif] text-[15px] text-black placeholder-[#737373] outline-none disabled:opacity-60"
          />
        </div>

        <div>
          <label className="font-['DM_Serif_Text',serif] text-[18px] text-black block mb-1">
            Contrasena
          </label>
          <input
            data-cy="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*********"
            disabled={loading}
            className="w-full h-[50px] bg-white px-4 font-['DM_Serif_Text',serif] text-[15px] text-black placeholder-[#737373] outline-none disabled:opacity-60"
          />
        </div>

        {error && (
          <p data-cy="error-msg" className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        <p className="text-right font-['DM_Serif_Text',serif] text-[14px] text-[#737373] cursor-pointer">
          Olvide mi contrasena
        </p>

        <button
          data-cy="submit"
          type="submit"
          disabled={loading}
          className="w-full h-[50px] bg-[#f48a32] rounded-lg font-['DM_Serif_Text',serif] text-[18px] text-white mt-4 active:opacity-80 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>

        <p className="text-center text-[#737373] text-xs mt-4">
          Usuarios demo: 183112 / 1 / 2 / 183913 / (pass: password123)
        </p>
      </form>
    </div>
  );
}
