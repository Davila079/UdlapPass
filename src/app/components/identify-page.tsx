import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, ScanLine } from "lucide-react";

const directory = [
  { id: "182634", name: "Melissa Hernandez", role: "Estudiante", carrera: "Lic. Negocios Internacionales", photo: "https://images.unsplash.com/photo-1597169012417-3fb4c7cd8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", status: "activo" },
  { id: "300100", name: "Carlos Martinez", role: "Seguridad", carrera: undefined, photo: "https://images.unsplash.com/photo-1775740865980-9cdb0b0c71f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", status: "activo" },
  { id: "500200", name: "Laura Sanchez", role: "Empleado", carrera: undefined, photo: "https://images.unsplash.com/photo-1597169012417-3fb4c7cd8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", status: "activo" },
  { id: "400562", name: "Denisse Cuevas", role: "Administrador", carrera: undefined, photo: "https://images.unsplash.com/photo-1687901733216-8125002ff4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", status: "activo" },
];

export function IdentifyPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = query.length > 0
    ? directory.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.includes(query))
    : [];

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button onClick={() => navigate("/home")} className="text-[#ec5b13]">
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">Identificar</p>
      </div>

      <div className="px-4 pt-4">
        {/* Search */}
        <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 gap-2 mb-4">
          <Search size={18} className="text-[#737373]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o ID..."
            className="flex-1 bg-transparent outline-none font-['DM_Serif_Text',serif] text-[14px] text-black placeholder-[#737373]"
          />
        </div>

        <button
          onClick={() => navigate("/scan")}
          className="w-full bg-white rounded-full shadow-sm py-3 mb-6 flex items-center justify-center gap-2 active:opacity-80"
        >
          <ScanLine size={20} className="text-[#ec5b13]" />
          <span className="font-['DM_Serif_Text',serif] text-[#ec5b13] text-[16px]">Escanear QR para identificar</span>
        </button>

        {/* Results */}
        <div className="space-y-3">
          {results.map((person) => (
            <div key={person.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ec5b13] shrink-0">
                <img src={person.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['DM_Serif_Text',serif] text-[16px] text-black truncate">{person.name}</p>
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">ID: {person.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#ec5b13] text-white text-[10px] px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">{person.role}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-[#737373]">{person.status}</span>
                  </div>
                </div>
                {person.carrera && (
                  <p className="font-['DM_Serif_Text',serif] text-[11px] text-[#737373] mt-0.5">{person.carrera}</p>
                )}
              </div>
            </div>
          ))}
          {query.length > 0 && results.length === 0 && (
            <p className="text-center text-[#737373] font-['DM_Serif_Text',serif] text-[14px] mt-8">No se encontraron resultados</p>
          )}
          {query.length === 0 && (
            <p className="text-center text-[#737373] font-['DM_Serif_Text',serif] text-[14px] mt-8">Ingresa un nombre o ID para buscar</p>
          )}
        </div>
      </div>
    </div>
  );
}
