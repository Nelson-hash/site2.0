import React, { useEffect, useRef } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("L'autoplay a été bloqué par le navigateur :", error);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      />
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/video-poster.jpg"
        style={{ filter: 'brightness(0.8) contrast(1.1)' }}
      >
        <source src="/videos/background-video2.mp4" type="video/mp4" />
        <img 
          src="/images/background.gif" 
          alt="Background fallback" 
          className="w-full h-full object-cover"
        />
      </video>
    </div>
  );
};

export default VideoBackground;
