import { startTransition, StrictMode, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { ContractsService } from "./services/initialization";
import { WalletProvider } from "./hooks/use-wallet";
import { SidebarProvider } from "./components/ui/sidebar";

// export async function clientLoader() {
  
//   return {
//     contractService
//   }
// }

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />  
    </StrictMode>
  );
});
