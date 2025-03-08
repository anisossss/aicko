import { useEffect, useRef, useState } from "react";

const AssetPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (src) {
      videoRef.current!.src = src;
      videoRef.current!.load();
      videoRef.current!.play();
      videoRef.current!.onerror = () => {
        setError("Failed to load the stream. Please try again.");
      };
    }
  }, [src]);

  return (
    <div className="player-container">
      {error ? (
        <div role="alert">
          <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
            Erreur Reseau
          </div>
          <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>Il y a un problème avec le streaming</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{ width: "100%" }}
        />
      )}
    </div>
  );
};

export default AssetPlayer;
