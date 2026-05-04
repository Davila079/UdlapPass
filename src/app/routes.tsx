import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { LoginPage } from "./components/login-page";
import { HomePage } from "./components/home-page";
import { QrPage } from "./components/qr-page";
import { CredentialPage } from "./components/credential-page";
import { ScanPage } from "./components/scan-page";
import { ReportsPage } from "./components/reports-page";
import { ScanAccessPage } from "./components/scan-access-page";
import { AdminScanPage } from "./components/admin-scan-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LoginPage },
      { path: "home", Component: HomePage },
      { path: "qr", Component: QrPage },
      { path: "credential", Component: CredentialPage },
      { path: "scan", Component: ScanPage },
      { path: "scan-access", Component: ScanAccessPage },
      { path: "admin-scan", Component: AdminScanPage },
      { path: "reports", Component: ReportsPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);