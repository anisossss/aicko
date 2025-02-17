import { useXtreamContext } from "@/wrappers/UserContext";
import { Tv, Play, Film, Settings } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StreamingInterface() {
  const { account } = useXtreamContext();
  const navigate = useNavigate();

  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const formattedDate = currentTime.toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

useEffect(() => {
  console.log(account);
  
}, [account]);

  if (!account?.username) {
    return (
      <div className="h-screen w-screen bg-[#0a0a2e] text-white p-4 flex flex-col">

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a2e] text-white p-4 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-base sm:text-lg font-bold">
          <Tv className="w-6 h-6" />
          <span>{account.playlistName}</span>
          {/* <span className="text-xs opacity-70">Version 0</span> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span>{formattedTime}</span>
            <span>{formattedDate}</span>
          </div>
          <Link
            to="#"
            className="flex items-center gap-2 text-sm font-semibold hover:text-blue-400 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">PARAMETER</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="flex gap-4 w-full max-w-4xl justify-between">
          {/* Live Card */}
          <Link
            to="/tv"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Tv className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">LIVE</span>
            </div>
          </Link>

          {/* Movies Card */}
          <Link
            to="/movies"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Play className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">MOVIES</span>
            </div>
          </Link>

          {/* Series Card */}
          <Link
            to="#"
            className="flex-1 aspect-square flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col items-center gap-2">
              <Film className="w-12 h-12 sm:w-16 sm:h-16" />
              <span className="text-lg sm:text-xl font-bold">SERIES</span>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-wrap justify-between items-center gap-2 text-xs opacity-90 mt-6">
        <div></div>
        <Link to="#" className="text-blue-400 hover:underline"></Link>
        <div>Logged in as: {account?.username}</div>
      </footer>
    </div>
  );
}
