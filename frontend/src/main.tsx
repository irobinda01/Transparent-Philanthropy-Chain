import React from "react";
import { createRoot } from "react-dom/client";
import { ClientProvider } from '@micro-stacks/react';
import App from "./App";
import "./index.css";
import { NETWORK } from "./lib/stacks";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClientProvider network="testnet" appName="Transparent Philanthropy Chain" appIconUrl="/logo.svg">
      <App />
    </ClientProvider>
  </React.StrictMode>
);
