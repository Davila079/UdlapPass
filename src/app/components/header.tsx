import { LogOut } from "lucide-react";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";

export function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(248,246,246,0.9)] flex h-14 items-center justify-between px-4 border-b border-[rgba(236,91,19,0.1)]">
      <span className="font-['Lexend',sans-serif] font-bold text-[#ec5b13] text-xl tracking-tight">
        UDLAP
      </span>
      <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-[#ec5b13] transition-colors">
        <LogOut size={22} />
      </button>
    </div>
  );
}
