import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import { TenantProvider } from "./app/contexts/TenantContext";
import { GatePassProvider } from "./app/contexts/GatePassContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <TenantProvider>
      <GatePassProvider>
        <App />
      </GatePassProvider>
    </TenantProvider>
  </BrowserRouter>
);
