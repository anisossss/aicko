import { useEffect, useRef, useState } from "react";
import mpegts from "mpegts.js";
import "./player.css"; // Import the CSS file

const Player = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mpegts.getFeatureList().mseLivePlayback) {
      const player = mpegts.createPlayer({
        type: "mse",
        isLive: true,
        url: src,
      });

      player.attachMediaElement(videoRef.current!);
      player.load();
      player.play();
      player.on(mpegts.Events.LOADING_COMPLETE, () => {});

      player.on(mpegts.Events.ERROR, (err) => {
        console.error("Player error:", err);
        setError("Failed to load the stream. Please try again.");
      });

      return () => {
        player.destroy();
      };
    } else {
      setError("Your browser does not support this video format.");
    }
  }, []);

  return (
    <div className="player-container">
      {error ? (
        <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Erreur Reseau
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>Il y aun problème avec le streaming</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{ width: "100%", maxHeight: "60vh" }}
        />
      )}
    </div>
  );
};

export default Player;
