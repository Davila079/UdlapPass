import { Outlet } from "react-router";
import { AuthProvider } from "./auth-context";

export function Layout() {
  return (
    <AuthProvider>
      <div className="max-w-md mx-auto min-h-screen bg-[#f1f1f1] relative shadow-xl">
        <Outlet />
      </div>
    </AuthProvider>
  );
}
