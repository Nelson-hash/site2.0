import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import VideoBackground from './components/VideoBackground';
import CustomCursor from './components/CustomCursor';
import { CursorProvider } from './context/CursorContext';
import Films from './pages/Films';
import About from './pages/About';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="relative h-screen w-screen overflow-hidden">
        <VideoBackground />
        <Layout />
      </div>
    ),
  },
  {
    path: "/films",
    element: <Films />,
  },
  {
    path: "/about",
    element: (
      <div className="relative h-screen w-screen overflow-hidden">
        <VideoBackground />
        <About />
      </div>
    ),
  },
]);

function App() {
  return (
    <CursorProvider>
      <RouterProvider router={router} />
      <CustomCursor />
    </CursorProvider>
  );
}

export default App;