import { useRef, useState } from "react";
import styles from "./VideoBlock.module.css";

export default function VideoBlock() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={styles.videoBlock}>
      <div className="container">
        <h1>
          Получите более подробную информацию о нашей организации из видео
        </h1>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            onClick={togglePlayPause}
          >
            <source src="/img/sample.mp4" type="video/mp4" />
          </video>
          <button
            className={styles.playButton}
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
