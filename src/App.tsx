import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import CustomCursor from './components/CustomCursor';
import { CursorProvider } from './context/CursorContext';
import VideoBackground from './components/VideoBackground';

// --- LAZY LOADING DES PAGES ---
const Films = lazy(() => import('./pages/Films'));
const About = lazy(() => import('./pages/About'));
const Commercial = lazy(() => import('./pages/Commercial'));

// --- COMPOSANT DE CHARGEMENT SECONDAIRE ---
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-black/40 backdrop-blur-sm fixed inset-0 z-50 pointer-events-none">
    <div className="animate-pulse text-xl md:text-2xl font-bold tracking-[0.25em] uppercase text-white">
      HORUS
    </div>
  </div>
);

// --- ROUTEUR STATIQUE (Évite les recréations à chaque rendu) ---
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="relative w-full min-h-screen overflow-auto md:h-screen md:overflow-hidden">
        <Layout />
      </div>
    ),
  },
  {
    path: "/films",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Films />
      </Suspense>
    ),
  },
  {
    path: "/about",
    element: (
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <About />
        </Suspense>
      </div>
    ),
  },
  {
    path: "/commercial",
    element: (
      <div className="relative min-h-screen w-full overflow-x-hidden">
        <Suspense fallback={<PageLoader />}>
          <Commercial />
        </Suspense>
      </div>
    ),
  },
]);

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppReady(true), 1800);

    // Préchargement en tâche de fond des visuels clés
    const urls = [
      "/images/pub/4.jpg",
      "/images/pub/5.jpg",
      "/images/pub/7.jpg",
      "/images/pub/8.jpg",
      "/images/pub/9.jpg",
      "/images/pub/Miam-Logo.png"
    ];
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <CursorProvider>
      {/* ÉCRAN DE CHARGEMENT INITIAL */}
      <div className={`preloader ${isAppReady ? 'preloader--hidden' : ''}`} aria-hidden="true">
        <div className="loader-logo">HORUS</div>
        <div className="loader-bar-container">
          <div className="loader-bar" style={isAppReady ? { width: '100%', transition: 'width 0.2s ease' } : {}} />
        </div>
      </div>

      {/* VIDÉO DE FOND GLOBALE */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <VideoBackground />
      </div>

      {/* ROUTEUR PRINCIPAL */}
      <RouterProvider router={router} />

      {/* FOOTER GLOBAL */}
      <div className="fixed bottom-5 left-5 md:bottom-6 md:left-6 z-40 text-white/30 text-[10px] md:text-xs tracking-widest font-light mix-blend-difference transition-opacity duration-500 hover:text-white/90 cursor-default pointer-events-none md:pointer-events-auto">
        © 2026 Nelson
      </div>

      {/* CURSEUR PERSONNALISÉ */}
      <CustomCursor />
    </CursorProvider>
  );
}

export default App;
