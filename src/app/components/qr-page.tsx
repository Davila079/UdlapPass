import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, RefreshCw } from "lucide-react";

export function QrPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState(Date.now().toString(36));
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setToken(Date.now().toString(36));
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const qrData = useMemo(() => JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
    token,
    timestamp: token,
  }), [token, user]);

  const regenerate = () => {
    setToken(Date.now().toString(36));
    setCountdown(30);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button onClick={() => navigate("/home")} className="text-[#ec5b13]">
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">UDLAP</p>
      </div>

      <div className="px-6 pt-6 flex flex-col items-center">
        <h2 className="font-['DM_Serif_Text',serif] text-[24px] text-black mb-2">Codigo QR Dinamico</h2>
        <p className="text-[#737373] font-['DM_Serif_Text',serif] text-sm mb-6">
          Este codigo se actualiza cada 30 segundos
        </p>

        {/* QR Container */}
        <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center">
          <QRCodeSVG
            value={qrData}
            size={250}
            level="H"
            fgColor="#ec5b13"
            bgColor="#ffffff"
            includeMargin
          />

          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f1f1" strokeWidth="3" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#ec5b13"
                  strokeWidth="3"
                  strokeDasharray={`${(countdown / 30) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-['DM_Serif_Text',serif] text-[14px] text-[#ec5b13]">
                {countdown}
              </span>
            </div>
            <button onClick={regenerate} className="text-[#ec5b13] active:opacity-60">
              <RefreshCw size={24} />
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="font-['DM_Serif_Text',serif] text-[18px] text-black">{user.name}</p>
            <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373]">ID: {user.id}</p>
          </div>
        </div>

        <p className="mt-6 text-[#737373] text-xs text-center max-w-xs">
          Muestra este codigo al personal de seguridad para registrar tu entrada o salida.
        </p>
      </div>
    </div>
  );
}