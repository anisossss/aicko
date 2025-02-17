import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XtreamProvider } from "@/wrappers/UserContext";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <XtreamProvider>{children}</XtreamProvider>
    </QueryClientProvider>
  );
};
