import React, { createContext, useContext, useState, ReactNode } from "react";

import user1 from "../../assets/user1.jpg";
import user2 from "../../assets/user2.jpg";
import user3 from "../../assets/user3.jpg";
import user4 from "../../assets/user4.jpg";
import user5 from "../../assets/user5.jpg";
import user6 from "../../assets/user6.jpg";
import user7 from "../../assets/user7.jpg";
import user8 from "../../assets/user8.jpg";
import user9 from "../../assets/user9.jpg";

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

// Forma serializable (sin módulos de imagen importados)
interface StoredSession {
  id: string;
  name: string;
  role: UserRole;
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

const SESSION_KEY = "udlappass_session";

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

const studentPhotos: Record<string, string> = {
  "183604": user3,
  "183112": user6,
  "183913": user8,
};

const getUserPhoto = (id: string, role: string) => {
  const cleanId = String(id).trim();
  if (role === "estudiante") return studentPhotos[cleanId] || user4;
  if (role === "administrador") return user5;
  if (role === "empleado") return user9;
  if (role === "seguridad") return user3;
  return user4;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer síncrono: restaura la sesión antes del primer render
  // evitando el flash de redirect en rutas protegidas al recargar la página
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const stored: StoredSession = JSON.parse(raw);
      return { ...stored, photo: getUserPhoto(stored.id, stored.role) };
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  });

  const login = async (id: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (!response.ok) return false;

      const { user: u } = await response.json();
      const userId = String(u.id).trim();

      const session: StoredSession = {
        id: userId,
        name: u.full_name,
        role: u.role,
        carrera: u.career,
        semestre: u.semester,
        beca: u.scholarship,
        residente: !!u.is_resident,
        colegio: u.residence,
        departamento: u.area,
        activo: !!u.is_enrolled || !!u.is_active || u.role === "administrador",
        activoDesde: new Date().getFullYear(),
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));

      setUser({
        ...session,
        photo: getUserPhoto(userId, u.role),
      });

      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
