import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1]">
      <img
        src="/videos/background-video2.mp4"
        alt="Background animation"
        className="video-background w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) contrast(1.1)' }}
      />
    </div>
  );
};

export default VideoBackground;
