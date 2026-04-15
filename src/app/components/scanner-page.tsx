import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./auth-context";
import { Header } from "./header";
import { X, ScanLine, Car, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";

type ScanMode = "entry" | "exit" | "vehicle" | "identify";

interface ScanResult {
  success: boolean;
  name: string;
  id: string;
  role: string;
  type: string;
  time: string;
}

const mockPeople = [
  { name: "Melissa Hernandez", id: "182634", role: "Estudiante" },
  { name: "Juan Pérez", id: "183001", role: "Estudiante" },
  { name: "Ana López", id: "184522", role: "Estudiante" },
  { name: "Carlos Mendoza", id: "300145", role: "Empleado" },
  { name: "Laura Torres", id: "300200", role: "Empleado" },
];

export function ScannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<ScanMode>("entry");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  if (!user) return null;

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const person = mockPeople[Math.floor(Math.random() * mockPeople.length)];
      const success = Math.random() > 0.15;
      setResult({
        success,
        name: person.name,
        id: person.id,
        role: person.role,
        type: mode === "entry" ? "Entrada" : mode === "exit" ? "Salida" : mode === "vehicle" ? "Vehículo" : "Identificación",
        time: new Date().toLocaleTimeString("es-MX"),
      });
      setScanning(false);
    }, 1500);
  };

  const modeConfig = {
    entry: { label: "Entrada", icon: <CheckCircle size={18} />, color: "bg-green-500" },
    exit: { label: "Salida", icon: <CheckCircle size={18} />, color: "bg-blue-500" },
    vehicle: { label: "Vehículo", icon: <Car size={18} />, color: "bg-purple-500" },
    identify: { label: "Identificar", icon: <UserCheck size={18} />, color: "bg-[#ec5b13]" },
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <Header />
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['DM_Serif_Text',serif] text-xl text-[#ec5b13]">Escáner QR</h2>
          <button onClick={() => navigate("/home")} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(Object.keys(modeConfig) as ScanMode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-['DM_Serif_Text',serif] transition-all ${
                mode === m
                  ? "bg-[#ec5b13] text-white shadow-lg"
                  : "bg-white text-gray-600 shadow"
              }`}
            >
              {modeConfig[m].icon}
              {modeConfig[m].label}
            </button>
          ))}
        </div>

        {/* Scanner Area */}
        <div className="bg-black rounded-2xl aspect-square max-w-sm mx-auto flex items-center justify-center relative overflow-hidden">
          {scanning ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 border-2 border-[#f48a32] rounded-lg animate-pulse relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-0.5 bg-[#f48a32] animate-bounce" />
                </div>
              </div>
              <p className="text-white font-['DM_Serif_Text',serif] text-sm">Escaneando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 border-2 border-white/30 rounded-lg flex items-center justify-center">
                <ScanLine size={64} className="text-white/40" />
              </div>
              <p className="text-white/60 font-['DM_Serif_Text',serif] text-sm">
                Toca para escanear
              </p>
            </div>
          )}

          {/* Tap area */}
          {!scanning && (
            <button
              onClick={simulateScan}
              className="absolute inset-0"
              aria-label="Escanear"
            />
          )}
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-4 rounded-2xl p-4 ${result.success ? "bg-white" : "bg-red-50"} shadow-lg max-w-sm mx-auto`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle size={32} className="text-green-500 shrink-0" />
              ) : (
                <AlertTriangle size={32} className="text-red-500 shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-['DM_Serif_Text',serif] text-lg text-black">
                  {result.success ? "Acceso Autorizado" : "Acceso Denegado"}
                </p>
                <p className="font-['DM_Serif_Text',serif] text-sm text-gray-600">{result.name}</p>
                <p className="font-['DM_Serif_Text',serif] text-xs text-gray-400">ID: {result.id}</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#f48a32] text-white text-xs px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                    {result.role}
                  </span>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                    {result.type}
                  </span>
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                    {result.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
