import React from "react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function CredentialPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLabel = {
    estudiante: "Estudiante",
    empleado: "Empleado",
    seguridad: "Personal de Seguridad",
    administrador: "Administrador",
  }[user.role];

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button onClick={() => navigate("/home")} className="text-[#ec5b13]">
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">UDLAP</p>
      </div>

      <div className="px-6 pt-6 flex flex-col items-center">
        <h2 className="font-['DM_Serif_Text',serif] text-[24px] text-black mb-6">Credencial Virtual</h2>

        {/* Card front */}
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Orange header */}
          <div className="bg-gradient-to-r from-[#ec5b13] to-[#f48a32] px-6 py-4 flex items-center justify-between">
            <p className="font-['Lexend',sans-serif] font-bold text-white text-[18px] tracking-[-0.5px]">UDLAP</p>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-['DM_Serif_Text',serif]">
              {user.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          {/* Photo + info */}
          <div className="px-6 py-5 flex gap-4">
            <div className="w-24 h-28 rounded-xl overflow-hidden shrink-0 border-2 border-[#ec5b13]">
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['DM_Serif_Text',serif] text-[18px] text-black truncate">{user.name}</h3>
              <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373]">ID: {user.id}</p>
              <span className="inline-block mt-1 bg-[#ec5b13] text-white text-[11px] px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                {roleLabel}
              </span>
              {user.carrera && (
                <p className="font-['DM_Serif_Text',serif] text-[12px] text-[#737373] mt-1 leading-tight">{user.carrera}</p>
              )}
              {user.departamento && (
                <p className="font-['DM_Serif_Text',serif] text-[12px] text-[#737373] mt-1">{user.departamento}</p>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="px-6 pb-4 grid grid-cols-2 gap-2">
            {user.semestre && (
              <InfoChip label="Semestre" value={String(user.semestre)} />
            )}
            {user.beca && (
              <InfoChip label="Beca" value={user.beca} />
            )}
            {user.residente !== undefined && (
              <InfoChip label="Residente" value={user.residente ? "Si" : "No"} />
            )}
            {user.colegio && (
              <InfoChip label="Colegio" value={user.colegio} />
            )}
            {user.puesto && (
              <InfoChip label="Puesto" value={user.puesto} />
            )}
            <InfoChip label="Desde" value={String(user.activoDesde)} />
          </div>

          {/* Mini QR */}
          <div className="px-6 pb-5 flex justify-center">
            <QRCodeSVG
              value={JSON.stringify({ id: user.id, name: user.name, role: user.role })}
              size={80}
              fgColor="#ec5b13"
              level="M"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f1f1f1] rounded-lg px-3 py-1.5">
      <p className="font-['DM_Serif_Text',serif] text-[10px] text-[#737373]">{label}</p>
      <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#ec5b13] truncate">{value}</p>
    </div>
  );
}
