import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ScanLine, Car, UserCheck, CheckCircle, XCircle } from "lucide-react";

type ScanMode = "entrada" | "salida" | "vehicular" | "identificar";

const mockScanResults: Record<string, { name: string; id: string; role: string; photo: string; carrera?: string; status: string }> = {
  scan1: { name: "Melissa Hernandez", id: "182634", role: "Estudiante", photo: "https://images.unsplash.com/photo-1597169012417-3fb4c7cd8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", carrera: "Lic. Negocios Internacionales", status: "activo" },
  scan2: { name: "Carlos Martinez", id: "300100", role: "Seguridad", photo: "https://images.unsplash.com/photo-1775740865980-9cdb0b0c71f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200", status: "activo" },
};

export function ScanPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>("entrada");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof mockScanResults.scan1 | null>(null);
  const [registered, setRegistered] = useState(false);

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setRegistered(false);
    setTimeout(() => {
      const keys = Object.keys(mockScanResults);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setResult(mockScanResults[randomKey]);
      setScanning(false);
    }, 1500);
  };

  const registerAccess = () => {
    setRegistered(true);
  };

  const modes: { key: ScanMode; label: string; icon: React.ReactNode }[] = [
    { key: "entrada", label: "Entrada", icon: <CheckCircle size={18} /> },
    { key: "salida", label: "Salida", icon: <XCircle size={18} /> },
    { key: "vehicular", label: "Vehicular", icon: <Car size={18} /> },
    { key: "identificar", label: "Identificar", icon: <UserCheck size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button onClick={() => navigate("/home")} className="text-[#ec5b13]">
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">UDLAP</p>
      </div>

      <div className="px-4 pt-4">
        <h2 className="font-['DM_Serif_Text',serif] text-[22px] text-black text-center mb-4">Escanear QR</h2>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setResult(null); setRegistered(false); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-['DM_Serif_Text',serif] whitespace-nowrap transition-colors ${
                mode === m.key
                  ? "bg-[#ec5b13] text-white"
                  : "bg-white text-[#ec5b13] shadow-sm"
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {/* Scanner area */}
        <div className="bg-black rounded-2xl aspect-square max-w-xs mx-auto flex items-center justify-center relative overflow-hidden">
          {scanning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-48 h-48 border-2 border-[#ec5b13] rounded-lg animate-pulse" />
              <p className="text-white text-sm font-['DM_Serif_Text',serif]">Escaneando...</p>
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#ec5b13] animate-bounce" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ScanLine size={80} className="text-[#ec5b13]/50" />
              <p className="text-white/60 text-sm font-['DM_Serif_Text',serif]">
                {mode === "vehicular" ? "Apunta a la placa/QR vehicular" : "Apunta al codigo QR"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={simulateScan}
          disabled={scanning}
          className="w-full max-w-xs mx-auto block mt-4 bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[18px] active:opacity-80 disabled:opacity-50"
        >
          {scanning ? "Escaneando..." : "Simular Escaneo"}
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-5 max-w-xs mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#ec5b13]">
                <img src={result.photo} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-['DM_Serif_Text',serif] text-[16px] text-black">{result.name}</p>
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">ID: {result.id}</p>
                <span className="inline-block bg-[#ec5b13] text-white text-[10px] px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                  {result.role}
                </span>
              </div>
            </div>
            {result.carrera && (
              <p className="mt-2 text-[12px] text-[#737373] font-['DM_Serif_Text',serif]">{result.carrera}</p>
            )}
            <div className="mt-2 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${result.status === "activo" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-[#737373] font-['DM_Serif_Text',serif]">
                {result.status === "activo" ? "Usuario Activo" : "Usuario Inactivo"}
              </span>
            </div>

            {mode !== "identificar" && !registered && (
              <button
                onClick={registerAccess}
                className="w-full mt-3 bg-[#ec5b13] text-white py-2 rounded-full font-['DM_Serif_Text',serif] text-[15px]"
              >
                Registrar {mode === "entrada" ? "Entrada" : mode === "salida" ? "Salida" : "Acceso Vehicular"}
              </button>
            )}

            {registered && (
              <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-['DM_Serif_Text',serif] text-[14px]">
                  {mode === "entrada" ? "Entrada" : mode === "salida" ? "Salida" : "Acceso"} registrada correctamente
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
