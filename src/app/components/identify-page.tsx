import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Search, ScanLine } from "lucide-react";

interface Person {
  id: string;
  name: string;
  role: string;
  career?: string;
  is_enrolled: boolean;
}

export function IdentifyPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/search?query=${text}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error buscando:', error);
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(e) => handleSearch(e.target.value)}
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
          {loading && (
            <p className="text-center text-[#737373] font-['DM_Serif_Text',serif] text-[14px] mt-8">Buscando...</p>
          )}

          {!loading && results.map((person) => (
            <div key={person.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ec5b13] shrink-0 bg-[#f1f1f1] flex items-center justify-center">
                <span className="text-[#ec5b13] font-bold text-[20px]">
                  {person.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-['DM_Serif_Text',serif] text-[16px] text-black truncate">{person.name}</p>
                <p className="font-['DM_Serif_Text',serif] text-[13px] text-[#737373]">ID: {person.id}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-[#ec5b13] text-white text-[10px] px-2 py-0.5 rounded-full font-['DM_Serif_Text',serif]">{person.role}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${person.is_enrolled ? 'bg-green-500' : 'bg-red-400'}`} />
                    <span className="text-[10px] text-[#737373]">{person.is_enrolled ? 'Inscrito' : 'No inscrito'}</span>
                  </div>
                </div>
                {person.career && (
                  <p className="font-['DM_Serif_Text',serif] text-[11px] text-[#737373] mt-0.5">{person.career}</p>
                )}
              </div>
            </div>
          ))}

          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-center text-[#737373] font-['DM_Serif_Text',serif] text-[14px] mt-8">No se encontraron resultados</p>
          )}

          {query.length < 2 && (
            <p className="text-center text-[#737373] font-['DM_Serif_Text',serif] text-[14px] mt-8">Ingresa un nombre o ID para buscar</p>
          )}
        </div>
      </div>
    </div>
  );
}