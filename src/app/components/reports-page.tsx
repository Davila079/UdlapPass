import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Filter } from "lucide-react";
import { mockAccessLogs } from "./auth-context";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function ReportsPage() {
  const navigate = useNavigate();
  const [filterRole, setFilterRole] = useState("todos");
  const [filterType, setFilterType] = useState("todos");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockAccessLogs.filter((log) => {
    if (filterRole !== "todos" && log.role !== filterRole) return false;
    if (filterType !== "todos" && log.type !== filterType) return false;
    if (filterDate && log.date !== filterDate) return false;
    return true;
  });

  // Chart data
  const byDay = filtered.reduce((acc, log) => {
    acc[log.date] = (acc[log.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  const entradas = filtered.filter((l) => l.type === "entrada").length;
  const salidas = filtered.filter((l) => l.type === "salida").length;
  const pieData = [
    { name: "Entradas", value: entradas },
    { name: "Salidas", value: salidas },
  ];
  const COLORS = ["#ec5b13", "#f48a32"];

  return (
    <div className="min-h-screen bg-[#f1f1f1]">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-[rgba(248,246,246,0.9)] border-b border-[rgba(236,91,19,0.1)] flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/home")} className="text-[#ec5b13]">
            <ArrowLeft size={24} />
          </button>
          <p className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-[20px] tracking-[-0.5px]">Reportes</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="text-[#ec5b13]">
          <Filter size={22} />
        </button>
      </div>

      <div className="px-4 pt-4 pb-8">
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-3">
            <div>
              <label className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] block mb-1">Rol</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-[#f1f1f1] rounded-lg px-3 py-2 text-sm font-['DM_Serif_Text',serif] outline-none"
              >
                <option value="todos">Todos</option>
                <option value="estudiante">Estudiante</option>
                <option value="empleado">Empleado</option>
                <option value="seguridad">Seguridad</option>
              </select>
            </div>
            <div>
              <label className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] block mb-1">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-[#f1f1f1] rounded-lg px-3 py-2 text-sm font-['DM_Serif_Text',serif] outline-none"
              >
                <option value="todos">Todos</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <div>
              <label className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373] block mb-1">Fecha</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-[#f1f1f1] rounded-lg px-3 py-2 text-sm font-['DM_Serif_Text',serif] outline-none"
              />
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard label="Total" value={String(filtered.length)} />
          <MetricCard label="Entradas" value={String(entradas)} />
          <MetricCard label="Salidas" value={String(salidas)} />
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mb-2">Registros por dia</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'DM Serif Text', serif" }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ec5b13" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] mb-2">Entradas vs Salidas</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <p className="font-['DM_Serif_Text',serif] text-[14px] text-[#737373] px-4 pt-3 pb-2">Registros ({filtered.length})</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#f1f1f1] text-[11px] text-[#737373] font-['DM_Serif_Text',serif]">
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Metodo</th>
                  <th className="px-3 py-2">Hora</th>
                  <th className="px-3 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-b border-[#f1f1f1] text-[12px] font-['DM_Serif_Text',serif]">
                    <td className="px-3 py-2 text-black whitespace-nowrap">{log.name}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] text-white ${log.type === "entrada" ? "bg-green-500" : "bg-red-400"}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[#737373]">{log.method}</td>
                    <td className="px-3 py-2 text-[#737373]">{log.time}</td>
                    <td className="px-3 py-2 text-[#737373]">{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-3 py-3 text-center">
      <p className="font-['DM_Serif_Text',serif] text-[24px] text-[#ec5b13]">{value}</p>
      <p className="font-['DM_Serif_Text',serif] text-[11px] text-[#737373]">{label}</p>
    </div>
  );
}
