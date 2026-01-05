import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Optional: Overlay to ensure text remains readable on top of video */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} // Adjust opacity (0.4) as needed
      />

      <video
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
