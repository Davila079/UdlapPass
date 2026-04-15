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

const mockUsers: Record<string, { password: string; data: UserData }> = {
  "182634": {
    password: "1234",
    data: {
      id: "182634",
      name: "Melissa Hernandez",
      role: "estudiante",
      photo: "https://images.unsplash.com/photo-1597169012417-3fb4c7cd8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      carrera: "Licenciatura en Negocios Internacionales",
      semestre: 6,
      beca: "Beca Deportiva",
      residente: true,
      colegio: "Colegio Jose Gaos",
      activo: true,
      activoDesde: 2022,
    },
  },
  "400562": {
    password: "1234",
    data: {
      id: "400562",
      name: "Denisse Cuevas",
      role: "administrador",
      photo: "https://images.unsplash.com/photo-1687901733216-8125002ff4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      departamento: "Area de Deportes",
      puesto: "Coordinadora",
      activo: true,
      activoDesde: 2022,
    },
  },
  "300100": {
    password: "1234",
    data: {
      id: "300100",
      name: "Carlos Martinez",
      role: "seguridad",
      photo: "https://images.unsplash.com/photo-1775740865980-9cdb0b0c71f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      departamento: "Seguridad Universitaria",
      puesto: "Oficial de Seguridad",
      activo: true,
      activoDesde: 2020,
    },
  },
  "500200": {
    password: "1234",
    data: {
      id: "500200",
      name: "Laura Sanchez",
      role: "empleado",
      photo: "https://images.unsplash.com/photo-1597169012417-3fb4c7cd8c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      departamento: "Biblioteca",
      puesto: "Coordinadora de Servicios",
      activo: true,
      activoDesde: 2019,
    },
  },
};

interface AuthContextType {
  user: UserData | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const login = (id: string, password: string) => {
    const found = mockUsers[id];
    if (found && found.password === password) {
      setUser(found.data);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Mock access logs
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
