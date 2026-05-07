import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Layout } from "./components/layout";
import { LoginPage } from "./components/login-page";
import { HomePage } from "./components/home-page";
import { QrPage } from "./components/qr-page";
import { CredentialPage } from "./components/credential-page";
import { ScanPage } from "./components/scan-page";
import { ReportsPage } from "./components/reports-page";
import { ScanAccessPage } from "./components/scan-access-page";
import { AdminScanPage } from "./components/admin-scan-page";
import { useAuth } from "./components/auth-context";

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <Outlet />;
}

function AdminRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "administrador") return <Navigate to="/home" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LoginPage },
      {
        Component: ProtectedRoute,
        children: [
          { path: "home", Component: HomePage },
          { path: "qr", Component: QrPage },
          { path: "credential", Component: CredentialPage },
          { path: "scan", Component: ScanPage },
          { path: "scan-access", Component: ScanAccessPage },
          {
            Component: AdminRoute,
            children: [
              { path: "admin-scan", Component: AdminScanPage },
              { path: "reports", Component: ReportsPage },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
