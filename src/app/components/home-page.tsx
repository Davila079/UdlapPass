import React from "react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";
import { LogOut, QrCode, CreditCard, ScanLine, FileText } from "lucide-react";

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLabel = {
    estudiante: "Estudiante",
    empleado: "Empleado",
    seguridad: "Personal de Seguridad",
    administrador: "Administrador",
  }[user.role];

  const isAdmin = user.role === "administrador";

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center justify-between px-4 h-16">
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">UDLAP</p>
        <button onClick={() => { logout(); navigate("/"); }} className="text-[#ec5b13]">
          <LogOut size={24} />
        </button>
      </div>

      <div className="px-4 pb-8">
        {/* User Info */}
        <div className="flex items-start gap-3 mt-4">
          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-[#ec5b13]">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-['DM_Serif_Text',serif] text-[20px] text-black truncate">{user.name}</h2>
            <p className="font-['DM_Serif_Text',serif] text-[16px] text-[#737373]">ID: {user.id}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="bg-[#ec5b13] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                {roleLabel}
              </span>
              <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                Activo desde {user.activoDesde}
              </span>
            </div>
          </div>
        </div>

        {/* Extra info for students */}
        {user.role === "estudiante" && (
          <div className="mt-3 space-y-1">
            {user.carrera && (
              <span className="block bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif] w-fit">
                {user.carrera}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {user.semestre && (
                <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                  Semestre {user.semestre}
                </span>
              )}
              {user.residente !== undefined && (
                <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                  Residente: {user.residente ? "Si" : "No"}
                </span>
              )}
              {user.colegio && (
                <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                  {user.colegio}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {user.beca ? (
                <>
                  <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">Beca</span>
                  <span className="bg-white text-[#ec5b13] text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif] shadow-sm">{user.beca}</span>
                </>
              ) : (
                <span className="bg-white text-[#ec5b13] text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif] shadow-sm">Sin Beca</span>
              )}
            </div>
          </div>
        )}

        {/* Extra info for employees / admins */}
        {(user.role === "empleado" || user.role === "seguridad" || user.role === "administrador") && user.departamento && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
              {user.departamento}
            </span>
            {user.puesto && (
              <span className="bg-[#f48a32] text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
                {user.puesto}
              </span>
            )}
          </div>
        )}

        {/* Quick Access — todos los usuarios */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm px-4 py-2 text-center mb-4">
            <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[16px]">Acceso Rapido</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/qr")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center active:shadow-[0_0_15px_rgba(255,116,0,0.5)]">
                <QrCode size={48} className="text-[#ec5b13]" />
              </div>
              <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[14px]">Codigo QR</p>
            </button>

            <button
              onClick={() => navigate("/credential")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center active:shadow-[0_0_15px_rgba(255,116,0,0.5)]">
                <CreditCard size={48} className="text-[#ec5b13]" />
              </div>
              <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[14px]">Credencial Virtual</p>
            </button>

            <button
              onClick={() => navigate("/scan-access")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center active:shadow-[0_0_15px_rgba(255,116,0,0.5)]">
                <ScanLine size={48} className="text-[#ec5b13]" />
              </div>
              <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[14px]">Escanear Acceso</p>
            </button>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2 text-center mb-4">
              <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[16px]">Administrador</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/reports")}
                className="flex-1 bg-white rounded-full shadow-lg py-3 active:opacity-80"
              >
                <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[20px] text-center flex items-center justify-center gap-2">
                  <FileText size={20} /> Reportes
                </p>
              </button>
              <button
                onClick={() => navigate("/admin-scan")}
                className="flex-1 bg-white rounded-full shadow-lg py-3 active:opacity-80"
              >
                <p className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[20px] text-center flex items-center justify-center gap-2">
                  <ScanLine size={20} /> Acceso Manual
                </p>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}