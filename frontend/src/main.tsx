import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Theme>
    </QueryClientProvider>
  </StrictMode>
);
