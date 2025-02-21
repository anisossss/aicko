import { LangSelect } from "@/components/lang";
import { useXtreamContext } from "@/wrappers/UserContext";
import { Tv, Play, Film, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function StreamingInterface() {
  const { account } = useXtreamContext();
    const { t } = useTranslation();
  
  const navigate = useNavigate();

  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const formattedDate = currentTime.toLocaleDateString("fr-FR", {
    month: "numeric",
    day: "numeric",
    year: "numeric"
  });



  if (!account?.username) {
    return (
      <div className="h-screen w-screen   text-white p-4 flex flex-col">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
         {t("login")}
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen   text-white p-4 flex flex-col">
   
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold">
          <Tv className="w-6 h-6" />
          <span>{account.playlistName}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span>{formattedTime}</span>
            <span>{formattedDate}</span>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm font-semibold hover:text-blue-400 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">{t("settings")}</span>
          </Link>
          <LangSelect />
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="flex gap-4 w-full max-w-4xl justify-between">
          <Link
            to="/tv"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Tv className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">{t("live")}</span>
            </div>
          </Link>

          <Link
            to="/movies"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Play className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">{t("movies")}</span>
            </div>
          </Link>

          <Link
            to="/series"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Film className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">{t("series")}</span>
            </div>
          </Link>
        </div>
      </main>

      <footer className="flex flex-wrap justify-between items-center gap-2 text-xs opacity-90 mt-6">
        <div></div>
        <div>{t("logged")}: {account?.username}</div>
      </footer>
    </div>
  );
}
