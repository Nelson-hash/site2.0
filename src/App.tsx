import React, { lazy, Suspense, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import CustomCursor from './components/CustomCursor';
import { CursorProvider } from './context/CursorContext';
import { useIsMobile } from './hooks/useIsMobile';
import VideoBackground from './components/VideoBackground';

// --- LAZY LOADING DES PAGES ---
const Films = lazy(() => import('./pages/Films'));
const About = lazy(() => import('./pages/About'));
const Commercial = lazy(() => import('./pages/Commercial'));

// --- COMPOSANT DE CHARGEMENT SECONDAIRE (Pour la navigation entre les pages) ---
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-transparent backdrop-blur-sm fixed inset-0 z-50 pointer-events-none">
    <div className="animate-pulse text-2xl font-bold tracking-widest uppercase text-white">
      HORUS
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL APP ---
function App() {
  const isMobile = useIsMobile();
  const [isAppReady, setIsAppReady] = useState(false);

  // Simule le chargement initial de l'application et de la vidéo de fond
  useEffect(() => {
    // La barre de chargement CSS dure 2.5s, on fait disparaître l'écran juste après
    const timer = setTimeout(() => setIsAppReady(true), 2500);
    
    // Astuce d'optimisation : Préchargement des images de la page Commercial dès l'ouverture
    const urls = ["images/pub/4.jpg", "images/pub/5.jpg", "images/pub/7.jpg", "images/pub/8.jpg", "images/pub/9.jpg"];
    urls.forEach(url => { const img = new Image(); img.src = url; });

    return () => clearTimeout(timer);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className={`relative w-full ${isMobile ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'}`}>
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

  return (
    <CursorProvider>
      {/* CSS DE L'ÉCRAN DE CHARGEMENT INITIAL */}
      <style>{`
        .preloader {
          position: fixed;
          inset: 0;
          background-color: #111; /* Couleur de fond foncée pour contraster */
          color: #fff;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .preloader--hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        .loader-logo {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 30px;
        }
        .loader-bar-container {
          width: 220px;
          height: 1px;
          background: rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }
        .loader-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #ffffff;
          width: 0%;
          animation: loadAnim 2.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; 
        }
        @keyframes loadAnim {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* ÉCRAN DE CHARGEMENT INITIAL (Global App Loader) */}
      <div className={`preloader ${isAppReady ? 'preloader--hidden' : ''}`} aria-hidden="true">
        <div className="loader-logo">HORUS</div>
        <div className="loader-bar-container">
          <div className="loader-bar" style={isAppReady ? { width: '100%', transition: 'width 0.2s ease' } : {}} />
        </div>
      </div>

      {/* VIDÉO DE FOND GLOBALE (Ne recharge jamais grâce au routing) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <VideoBackground />
      </div>

      {/* ROUTEUR PRINCIPAL */}
      <RouterProvider router={router} />
      
      {/* FOOTER GLOBAL */}
      <div className="fixed bottom-6 left-6 z-50 text-white/30 text-xs tracking-widest font-light mix-blend-difference transition-opacity duration-500 hover:text-white/100 cursor-default pointer-events-none md:pointer-events-auto">
        © 2026 Nelson
      </div>

      {/* CURSEUR PERSONNALISÉ */}
      <CustomCursor />
    </CursorProvider>
  );
}

export default App;
