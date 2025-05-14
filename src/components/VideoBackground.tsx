import React, { useEffect, useRef, useState } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <>
      {!isLoaded && <div className="fixed inset-0 bg-black z-[-1]" />}
      <video
        ref={videoRef}
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/video-poster.jpg" // Add a static poster image
        onCanPlay={() => setIsLoaded(true)}
      >
        <source src="/videos/background-compressed.webm" type="video/webm" />
        <source src="/videos/background-compressed.mp4" type="video/mp4" />
      </video>
    </>
  );
};

export default VideoBackground;
