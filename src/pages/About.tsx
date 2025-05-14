import React from 'react';
import HomeLink from '../components/HomeLink';

const About = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute top-8 left-8">
        <HomeLink />
      </div>
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 text-white max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <div className="space-y-4">
            <p className="text-lg">
              We are a creative film production studio dedicated to crafting compelling visual narratives that captivate and inspire.
            </p>
            <p className="text-lg">
              Our team of passionate filmmakers combines technical expertise with artistic vision to bring stories to life through the lens of innovation and authenticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About