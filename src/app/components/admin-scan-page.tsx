import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./auth-context";
import { ArrowLeft, CheckCircle, XCircle, Loader } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

type Estado = "esperando" | "escaneando" | "confirmando" | "procesando" | "exito" | "error";

const UBICACIONES = ["Gaos", "Recta", "Periferico", "Proveedores"];

interface UsuarioEscaneado {
  id: string;
  name: string;
  role: string;
}

interface ResultadoAcceso {
  nombre: string;
  tipo: "entrada" | "salida";
  ubicacion: string;
  hora: string;
}

export function AdminScanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>("esperando");
  const [usuarioEscaneado, setUsuarioEscaneado] = useState<UsuarioEscaneado | null>(null);
  const [ubicacion, setUbicacion] = useState(UBICACIONES[0]);
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
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

  const iniciarEscaneo = async () => {
    setEstado("escaneando");
    setUsuarioEscaneado(null);
    setResultado(null);
    setMensajeError("");

    try {
      readerRef.current = new BrowserQRCodeReader();
      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        async (result: any) => {
          if (result) {
            detenerCamara();
            procesarQR(result.getText());
          }
        }
      );
      controlsRef.current = controls;
    } catch (err) {
      setEstado("error");
      setMensajeError("No se pudo acceder a la cámara. Verifica permisos.");
    }
  };

  const procesarQR = (texto: string) => {
    try {
      const datos = JSON.parse(texto);
      if (!datos.id || !datos.name || !datos.role) {
        setEstado("error");
        setMensajeError("QR no válido. No corresponde a un usuario UDLAP.");
        return;
      }
      setUsuarioEscaneado({ id: datos.id, name: datos.name, role: datos.role });
      setEstado("confirmando");
    } catch {
      setEstado("error");
      setMensajeError("QR no válido. No se pudo leer la información.");
    }
  };

  const registrarAcceso = async () => {
    if (!usuarioEscaneado) return;
    setEstado("procesando");

    try {
      const res = await fetch("http://localhost:3000/access-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: usuarioEscaneado.id,
          type: tipo,
          method: "QR",
          location: ubicacion,
        }),
      });

      if (!res.ok) throw new Error("Error al registrar");

      setResultado({
        nombre: usuarioEscaneado.name,
        tipo,
        ubicacion,
        hora: new Date().toLocaleTimeString("es-MX"),
      });
      setEstado("exito");
    } catch {
      setEstado("error");
      setMensajeError("Error al registrar el acceso. Intenta de nuevo.");
    }
  };

  const reintentar = () => {
    setEstado("esperando");
    setUsuarioEscaneado(null);
    setResultado(null);
    setMensajeError("");
  };

  if (!user || user.role !== "administrador") return null;

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center px-4 h-16 gap-3">
        <button onClick={() => { detenerCamara(); navigate("/home"); }} className="text-[#ec5b13]">
          <ArrowLeft size={24} />
        </button>
        <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">UDLAP</p>
      </div>

      <div className="px-6 pt-6 flex flex-col items-center">
        <h2 className="font-['DM_Serif_Text',serif] text-[24px] text-black mb-2">
          Acceso Manual
        </h2>
        <p className="text-[#737373] font-['DM_Serif_Text',serif] text-sm mb-6 text-center">
          Escanea el QR del usuario y elige la ubicación y tipo de acceso
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
                Apunta al código QR del usuario
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
                  Presiona el botón para escanear el QR del usuario
                </p>
              </div>
              <button
                data-cy="abrir-camara-admin"
                onClick={iniciarEscaneo}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Escanear QR de Usuario
              </button>
            </div>
          )}

          {/* Confirmando — el admin elige ubicación y tipo */}
          {estado === "confirmando" && usuarioEscaneado && (
            <div className="flex flex-col gap-4">

              {/* Info del usuario escaneado */}
              <div data-cy="usuario-escaneado" className="bg-white rounded-2xl shadow-lg p-4">
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">Usuario detectado</p>
                <p className="font-['DM_Serif_Text',serif] text-[18px] text-black mt-1">{usuarioEscaneado.name}</p>
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">ID: {usuarioEscaneado.id}</p>
                <span className="inline-block mt-1 bg-[#ec5b13] text-white text-[11px] px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">
                  {usuarioEscaneado.role}
                </span>
              </div>

              {/* Selector de tipo */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] mb-2">Tipo de acceso</p>
                <div className="flex gap-2">
                  <button
                    data-cy="tipo-entrada"
                    onClick={() => setTipo("entrada")}
                    className={`flex-1 py-2 rounded-full font-['DM_Serif_Text',serif] text-[15px] transition-colors ${
                      tipo === "entrada"
                        ? "bg-green-500 text-white"
                        : "bg-[#f1f1f1] text-[#737373]"
                    }`}
                  >
                    Entrada
                  </button>
                  <button
                    data-cy="tipo-salida"
                    onClick={() => setTipo("salida")}
                    className={`flex-1 py-2 rounded-full font-['DM_Serif_Text',serif] text-[15px] transition-colors ${
                      tipo === "salida"
                        ? "bg-red-400 text-white"
                        : "bg-[#f1f1f1] text-[#737373]"
                    }`}
                  >
                    Salida
                  </button>
                </div>
              </div>

              {/* Selector de ubicación */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] mb-2">Ubicación</p>
                <div className="grid grid-cols-2 gap-2">
                  {UBICACIONES.map((u) => (
                    <button
                      key={u}
                      data-cy={`ubicacion-${u.toLowerCase()}`}
                      onClick={() => setUbicacion(u)}
                      className={`py-2 rounded-full font-['DM_Serif_Text',serif] text-[14px] transition-colors ${
                        ubicacion === u
                          ? "bg-[#ec5b13] text-white"
                          : "bg-[#f1f1f1] text-[#737373]"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <button
                data-cy="confirmar-acceso"
                onClick={registrarAcceso}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Registrar {tipo === "entrada" ? "Entrada" : "Salida"} en {ubicacion}
              </button>
              <button
                onClick={reintentar}
                className="w-full bg-white text-[#ec5b13] border-2 border-[#ec5b13] py-3 rounded-full font-['DM_Serif_Text',serif] text-[15px]"
              >
                Cancelar
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
              <div data-cy="resultado-exito-admin" className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-3" />
                <p className="font-['DM_Serif_Text',serif] text-[22px] text-black">
                  {resultado.tipo === "entrada" ? "Entrada" : "Salida"} Registrada
                </p>
                <p className="font-['DM_Serif_Text',serif] text-[18px] text-black mt-1">
                  {resultado.nombre}
                </p>
                <p className="font-['DM_Serif_Text',serif] text-[16px] text-[#ec5b13] mt-1">
                  {resultado.ubicacion}
                </p>
                <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mt-1">
                  {resultado.hora}
                </p>
              </div>
              <button
                data-cy="escanear-otro-admin"
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
              <div data-cy="resultado-error-admin" className="bg-white rounded-2xl shadow-lg p-6 w-full text-center">
                <XCircle size={56} className="text-red-500 mx-auto mb-3" />
                <p className="font-['DM_Serif_Text',serif] text-[18px] text-black">Error</p>
                <p data-cy="error-msg-admin" className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mt-2">
                  {mensajeError}
                </p>
              </div>
              <button
                data-cy="reintentar-admin"
                onClick={reintentar}
                className="w-full bg-[#ec5b13] text-white py-3 rounded-full font-['DM_Serif_Text',serif] text-[16px] active:opacity-80"
              >
                Intentar de Nuevo
              </button>
            </div>
          )}

          {/* Botón oculto para Cypress */}
          <button
            data-cy="simular-qr-admin"
            style={{ display: 'none' }}
            onClick={() => procesarQR((window as any).__cypressQRAdmin || '{}')}
          />

        </div>
      </div>
    </div>
  );
}