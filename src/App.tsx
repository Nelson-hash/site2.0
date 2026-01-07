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
        // FIX: Changed w-screen to w-full, removed overflow-hidden logic
        <div className="relative min-h-screen w-full overflow-x-hidden">
          <VideoBackground />
          <Layout />
        </div>
      ),
    },
    {
      path: "/films",
      element: (
        // Films handles its own layout, so we don't wrap it in a blocking div
        <Suspense fallback={<PageLoader />}>
          <Films />
        </Suspense>
      ),
    },
    {
      path: "/about",
      element: (
        // FIX: Changed w-screen to w-full, removed overflow-hidden logic
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
