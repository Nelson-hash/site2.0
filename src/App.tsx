import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import CustomCursor from './components/CustomCursor';
import { CursorProvider } from './context/CursorContext';
import { useIsMobile } from './hooks/useIsMobile';
import VideoBackground from './components/VideoBackground';

const Films = lazy(() => import('./pages/Films'));
const About = lazy(() => import('./pages/About'));

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-black">
    <div className="animate-pulse text-2xl font-bold tracking-widest uppercase text-white">
      HORUS
    </div>
  </div>
);

function App() {
  const isMobile = useIsMobile();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className={`relative w-full ${isMobile ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'}`}>
          <VideoBackground />
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
          <VideoBackground />
          <Suspense fallback={<PageLoader />}>
            <About />
          </Suspense>
        </div>
      ),
    },
  ]);

  return (
    <CursorProvider>
      <RouterProvider router={router} />
      
      {/* Filigrane discret ajouté ici */}
      <div className="fixed bottom-6 left-6 z-50 text-white/30 text-xs tracking-widest font-light mix-blend-difference transition-opacity duration-500 hover:text-white/100 cursor-default pointer-events-none md:pointer-events-auto">
        © 2026 Nelson
      </div>

      <CustomCursor />
    </CursorProvider>
  );
}

export default App;
