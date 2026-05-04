import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./auth-context";
import { ArrowLeft, CheckCircle, XCircle, Loader } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

type Estado = "esperando" | "escaneando" | "procesando" | "exito" | "error";

interface ResultadoAcceso {
  tipo: "entrada" | "salida";
  ubicacion: string;
  hora: string;
}

export function ScanAccessPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>("esperando");
  const [resultado, setResultado] = useState<ResultadoAcceso | null>(null);
  const [mensajeError, setMensajeError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => detenerCamara();
  }, []);

  const detenerCamara = () => {
    try {
      controlsRef.current?.stop();
      controlsRef.current = null;
    } catch (_) {}
  };

  const procesarQR = async (texto: string) => {
    setEstado("procesando");

    try {
      const datos = JSON.parse(texto);
      if (datos.access !== "udlap" || !datos.location) {
        setEstado("error");
        setMensajeError("QR no válido. No es un acceso UDLAP.");
        return;
      }

      const ubicacion: string = datos.location;

      const resLast = await fetch(
        `http://localhost:3000/access-logs/last?user_id=${user!.id}`
      );
      const { last } = await resLast.json();
      const tipo: "entrada" | "salida" = last === "entrada" ? "salida" : "entrada";

      const resPost = await fetch("http://localhost:3000/access-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user!.id,
          type: tipo,
          method: "QR",
          location: ubicacion,
        }),
      });

      if (!resPost.ok) throw new Error("Error al registrar");

      setResultado({
        tipo,
        ubicacion,
        hora: new Date().toLocaleTimeString("es-MX"),
      });
      setEstado("exito");

    } catch (err) {
      setEstado("error");
      setMensajeError("Error al procesar el QR. Intenta de nuevo.");
    }
  };

  const iniciarEscaneo = async () => {
    setEstado("escaneando");
    setResultado(null);
    setMensajeError("");

    try {
      readerRef.current = new BrowserQRCodeReader();

      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        async (result: any, error: any) => {
          if (result) {
            detenerCamara();
            await procesarQR(result.getText());
          }
        }
      );

      controlsRef.current = controls;
    } catch (err) {
      console.error("Error cámara:", err);
      setEstado("error");
      setMensajeError("No se pudo acceder a la cámara. Verifica permisos en tu navegador.");
    }
  };

  const reintentar = () => {
    setEstado("esperando");
    setResultado(null);
    setMensajeError("");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button
          onClick={() => { detenerCamara(); navigate("/home"); }}
          className="text-[#ec5b13]"
        >
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">
          UDLAP
        </p>
      </div>

      <div className="px-6 pt-6 flex flex-col items-center">
        <h2 className="font-['DM_Serif_Text',serif] text-[24px] text-black mb-2">
          Escanear Acceso
        </h2>
        <p className="text-[#737373] font-['DM_Serif_Text',serif] text-sm mb-6 text-center">
          Apunta al código QR del acceso para registrar tu entrada o salida
        </p>

        <div className="w-full max-w-sm">

          {/* Video SIEMPRE en el DOM */}
          <div
            className="w-full rounded-2xl overflow-hidden bg-black relative"
            style={{ display: estado === "escaneando" ? "block" : "none" }}
          >
            <video
              ref={videoRef}
              className="w-full"
              style={{ maxHeight: 320, display: "block" }}
              autoPlay
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-[#ec5b13] rounded-lg" />
            </div>
          </div>

          {estado === "escaneando" && (
            <div className="flex flex-col items-center gap-4 mt-4">
              <p className="text-[#737373] font-['DM_Serif_Text',serif] text-sm text-center">
                Apunta al código QR del acceso
              </p>
              <button
                onClick={() => { detenerCamara(); reintentar(); }}
                className="w-full bg-white text-[#ec5b13] border-2 border-[#ec5b13] py-3 rounded-full font-['DM_Serif_Text',serif] text-[15px]"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Esperando */}
          {estado === "esperando" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-64 bg-black rounded-2xl flex items-center justify-center">
                <p className="text-white/50 font-['DM_Serif_Text',serif] text-sm text-center px-4">
                  Presiona el botón para abrir la cámara
                </p>
              </div>
              <button
                data-cy="abrir-camara"
                onClick={iniciarEscaneo}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Abrir Cámara
              </button>
            </div>
          )}

          {/* Procesando */}
          {estado === "procesando" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader size={48} className="text-[#ec5b13] animate-spin" />
              <p className="font-['DM_Serif_Text',serif] text-[16px] text-[#737373]">
                Registrando acceso...
              </p>
            </div>
          )}

          {/* Éxito */}
          {estado === "exito" && resultado && (
            <div className="flex flex-col items-center gap-4">
              <div data-cy="resultado-exito" className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
                <p className="font-['DM_Serif_Text',serif] text-[22px] text-black">
                  {resultado.tipo === "entrada" ? "Entrada" : "Salida"} Registrada
                </p>
                <p className="font-['DM_Serif_Text',serif] text-[16px] text-[#ec5b13] mt-1">
                  {resultado.ubicacion}
                </p>
                <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mt-1">
                  {resultado.hora}
                </p>
                <div className="mt-4 bg-[#f1f1f1] rounded-xl px-4 py-3 text-left">
                  <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">Usuario</p>
                  <p className="font-['DM_Serif_Text',serif] text-[15px] text-black">{user.name}</p>
                  <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] mt-1">ID</p>
                  <p className="font-['DM_Serif_Text',serif] text-[15px] text-black">{user.id}</p>
                </div>
              </div>
              <button
                data-cy="escanear-otro"
                onClick={reintentar}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Escanear Otro
              </button>
            </div>
          )}

          {/* Error */}
          {estado === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div data-cy="resultado-error" className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
                <XCircle size={56} className="text-red-500 mx-auto mb-3" />
                <p className="font-['DM_Serif_Text',serif] text-[18px] text-black">Error</p>
                <p data-cy="error-msg-scan" className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mt-2">
                  {mensajeError}
                </p>
              </div>
              <button
                data-cy="reintentar"
                onClick={reintentar}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Intentar de Nuevo
              </button>
            </div>
          )}

          {/* Botón oculto para Cypress — simula un escaneo sin cámara */}
          <button
            data-cy="simular-qr"
            style={{ display: 'none' }}
            onClick={() => procesarQR((window as any).__cypressQR || '{}')}
          />

        </div>
      </div>
    </div>
  );
}