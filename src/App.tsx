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
        // --- FIX 1: Restore h-screen and overflow-hidden for Home only ---
        // This ensures the Logo inside <Layout /> remains vertically centered.
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
        // About page should scroll if text is long
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
      <CustomCursor />
    </CursorProvider>
  );
}

export default App;
