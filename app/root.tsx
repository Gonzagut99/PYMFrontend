import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";
import { WalletProvider } from "./hooks/use-wallet";
import { SidebarProvider } from "./components/ui/sidebar";
import { useEffect, useState } from "react";
import { ContractsService } from "./services/initialization";
import toastStyles from "react-toastify/dist/ReactToastify.css?url";
import { ToastContainer } from "react-toastify";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: toastStyles },
];

export async function clientLoader() {
  const contractService = new ContractsService(); 
  return {
    contractService
  }
}
clientLoader.hydrate = true as const;

interface LayoutProps{
  children: React.ReactNode;
}

export function Layout({ children}: LayoutProps) {
  // const data = useRouteLoaderData('root');
  // const [open, setOpen] = useState(true)
  // let contractService: ContractsService = loaderData.contractService;
  // useEffect(() => {
  //   if ((typeof window.ethereum !== 'undefined')) {
  //     contractService = new ContractsService(); 
  //   }
  // }
  // , [])
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        
        <ScrollRestoration />
        <Scripts />
        <ToastContainer
        containerId={'rootToaster'}
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                ></ToastContainer>
      </body>
    </html>
  );
}



export default function App({ loaderData }: Route.ComponentProps) {
  const contractService = loaderData.contractService;
  const [open, setOpen] = useState(true)
  // let contractService: ContractsService;
  // // let contractService: ContractsService = loaderData.contractService;
  // useEffect(() => {
  //   if ((typeof window.ethereum !== 'undefined')) {
  //     contractService = new ContractsService(); 
  //   }
  // }
  // , [])
  return (
    <WalletProvider contractService={contractService!}>
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Outlet/>
    </SidebarProvider>
  </WalletProvider>
)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
