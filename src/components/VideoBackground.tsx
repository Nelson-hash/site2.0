import React, { useEffect, useRef, useState } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      
      // Force play the video
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };
      
      playVideo();
    }
  }, []);

  return (
    <div className="video-container">
      {/* Fallback background */}
      <div className="fixed inset-0 bg-black z-[-2]" />
      
      {/* Video */}
      <video
        ref={videoRef}
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
