import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Providers } from "./providers/providers.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./providers/router.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <div className="global">
        <RouterProvider router={router} />
      </div>
    </Providers>
  </StrictMode>
);
