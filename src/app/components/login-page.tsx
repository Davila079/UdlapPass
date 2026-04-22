import React, { useState } from "react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";
//import imgUdlap1 from "figma:asset/94454e9a7e3e91be5322a669fe39012d8be17a6a.png";

export function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  const success = await login(userId, password);
  if (success) {
    navigate("/home");
  } else {
    setError("ID o contraseña incorrectos");
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
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID Estudiante"
            className="w-full h-[50px] bg-white px-4 font-['DM_Serif_Text',serif] text-[15px] text-black placeholder-[#737373] outline-none"
          />
        </div>

        <div>
          <label className="font-['DM_Serif_Text',serif] text-[18px] text-black block mb-1">
            Contrasena
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*********"
            className="w-full h-[50px] bg-white px-4 font-['DM_Serif_Text',serif] text-[15px] text-black placeholder-[#737373] outline-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <p className="text-right font-['DM_Serif_Text',serif] text-[14px] text-[#737373] cursor-pointer">
          Olvide mi contrasena
        </p>

        <button
          type="submit"
          className="w-full h-[50px] bg-[#f48a32] rounded-lg font-['DM_Serif_Text',serif] text-[18px] text-white mt-4 active:opacity-80"
        >
          Ingresar
        </button>

        <p className="text-center text-[#737373] text-xs mt-4">
          Usuarios demo: 182634 / 400562 / 300100 / 500200 (pass: 1234)
        </p>
      </form>
    </div>
  );
}