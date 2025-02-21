import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XtreamProvider } from "@/wrappers/UserContext";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/config";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <XtreamProvider>{children}</XtreamProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};
