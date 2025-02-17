import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

// Définir le type du contexte
export type XtreamContextType = {
  account: XtreamType | null;
  setAccount: (account: XtreamType) => void;
  isLoading: boolean;
};

export type XtreamType = {
  playlistName: string;
  username: string;
  password: string;
  host: string;
  m3uUrl: string;
};

// Initialiser le contexte
export const XtreamContext = createContext<XtreamContextType>(
  {} as unknown as XtreamContextType
);

// Hook personnalisé pour utiliser le contexte
export const useXtreamContext = (): XtreamContextType => {
  const context = useContext(XtreamContext);
  if (!context) {
    throw new Error("useXtreamContext must be used within a XtreamProvider");
  }
  return context;
};

// Provider pour encapsuler les composants enfants
export const XtreamProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<XtreamType | null>({
    playlistName: "",
    username: "",
    password: "",
    host: "",
    m3uUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const loadUserFromStorage = async () => {
  //     setIsLoading(true)
  //     const storedUser = localStorage.getItem('user')
  //     if (storedUser) {
  //       setAccount(JSON.parse(storedUser))
  //     }
  //     setIsLoading(false)
  //   }

  //   loadUserFromStorage()
  // }, [])

  return (
    <XtreamContext.Provider value={{ account, setAccount, isLoading }}>
      {children}
    </XtreamContext.Provider>
  );
};
