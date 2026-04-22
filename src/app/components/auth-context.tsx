import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "estudiante" | "empleado" | "seguridad" | "administrador";

export interface UserData {
  id: string;
  name: string;
  role: UserRole;
  photo: string;
  carrera?: string;
  semestre?: number;
  beca?: string;
  residente?: boolean;
  colegio?: string;
  departamento?: string;
  puesto?: string;
  activo: boolean;
  activoDesde: number;
}

interface AuthContextType {
  user: UserData | null;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const login = async (id: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) return false;

      const { user: u } = await response.json();

      setUser({
        id: String(u.id),
        name: u.full_name,
        role: u.role,
        photo: "",
        carrera: u.career,
        semestre: u.semester,
        beca: u.scholarship,
        residente: u.is_resident === 1,
        activo: u.is_enrolled === 1,
        activoDesde: new Date().getFullYear(),
      });

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const mockAccessLogs = [
  { id: 1, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "entrada", method: "QR", location: "Puerta Principal", date: "2026-04-15", time: "07:32" },
  { id: 2, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "salida", method: "QR", location: "Puerta Principal", date: "2026-04-15", time: "14:15" },
  { id: 3, userId: "500200", name: "Laura Sanchez", role: "empleado", type: "entrada", method: "Credencial", location: "Puerta Vehicular", date: "2026-04-15", time: "06:45" },
  { id: 4, userId: "300100", name: "Carlos Martinez", role: "seguridad", type: "entrada", method: "QR", location: "Caseta Norte", date: "2026-04-15", time: "06:00" },
  { id: 5, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "entrada", method: "Vehicular", location: "Puerta Vehicular", date: "2026-04-14", time: "08:10" },
  { id: 6, userId: "500200", name: "Laura Sanchez", role: "empleado", type: "salida", method: "QR", location: "Puerta Principal", date: "2026-04-14", time: "17:30" },
  { id: 7, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "entrada", method: "QR", location: "Puerta Principal", date: "2026-04-13", time: "09:00" },
  { id: 8, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "salida", method: "QR", location: "Puerta Principal", date: "2026-04-13", time: "13:45" },
  { id: 9, userId: "500200", name: "Laura Sanchez", role: "empleado", type: "entrada", method: "Credencial", location: "Puerta Principal", date: "2026-04-13", time: "07:00" },
  { id: 10, userId: "300100", name: "Carlos Martinez", role: "seguridad", type: "entrada", method: "QR", location: "Caseta Norte", date: "2026-04-13", time: "06:00" },
  { id: 11, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "entrada", method: "QR", location: "Puerta Principal", date: "2026-04-12", time: "07:50" },
  { id: 12, userId: "182634", name: "Melissa Hernandez", role: "estudiante", type: "salida", method: "QR", location: "Puerta Principal", date: "2026-04-12", time: "15:20" },
];