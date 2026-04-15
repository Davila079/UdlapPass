import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/layout";
import { LoginPage } from "./components/login-page";
import { HomePage } from "./components/home-page";
import { QrPage } from "./components/qr-page";
import { CredentialPage } from "./components/credential-page";
import { ScanPage } from "./components/scan-page";
import { ReportsPage } from "./components/reports-page";
import { IdentifyPage } from "./components/identify-page";

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
      { path: "reports", Component: ReportsPage },
      { path: "identify", Component: IdentifyPage },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
