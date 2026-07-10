import React, { useEffect, useRef } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force la lecture de la vidéo pour contourner les blocages Safari/iOS et Android
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.warn("L'autoplay a été bloqué par le navigateur :", error);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Optional: Overlay to ensure text remains readable on top of video */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} // Adjust opacity (0.4) as needed
      />

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline // Critical for iOS mobile support
        style={{ filter: 'brightness(0.8) contrast(1.1)' }} // Preserving your visual style
      >
        {/* The path starts from the public folder */}
        <source src="/videos/background-video2.mp4" type="video/mp4" />
        
        {/* Fallback for very old browsers or if video fails */}
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
