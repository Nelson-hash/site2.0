
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import CustomCursor from './components/CustomCursor';
import { CursorProvider } from './context/CursorContext';
import { useIsMobile } from './hooks/useIsMobile';

// Import normally for these critical components 
import VideoBackground from './components/VideoBackground';

// Lazy load pages
const Films = lazy(() => import('./pages/Films'));
const About = lazy(() => import('./pages/About'));

// Loading component
const PageLoader = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-black">
    <div className="animate-pulse text-xl">HORUS</div>
  </div>
);

// We need to create the router inside the component to use the mobile hook
function App() {
  const isMobile = useIsMobile();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div className={`relative ${isMobile ? 'min-h-screen' : 'h-screen'} w-screen ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
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
        <div className={`relative ${isMobile ? 'min-h-screen' : 'h-screen'} w-screen ${isMobile ? 'overflow-auto' : 'overflow-hidden'}`}>
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
