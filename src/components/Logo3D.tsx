import React, { useRef, useEffect, useState } from 'react';
import { useCursor } from '../context/CursorContext';

const Logo3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');
  const [isLoaded, setIsLoaded] = useState(false);
  const modelRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const { setHovered, isMobile } = useCursor();

  useEffect(() => {
    let isMounted = true;

    const initScene = async () => {
      try {
        setDebugInfo('Loading Three.js...');
        
        // Check if file exists first
        try {
          const response = await fetch('/horus.glb', { method: 'HEAD' });
          if (!response.ok) {
            setDebugInfo(`GLB file not found: ${response.status}`);
            createCSSFallback();
            return;
          }
          setDebugInfo('GLB file found, loading Three.js...');
        } catch (e) {
          setDebugInfo('Cannot check GLB file existence');
          createCSSFallback();
          return;
        }

        // Load Three.js from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        setDebugInfo('Three.js loaded, loading GLTFLoader...');
        
        // Load GLTFLoader from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js');
        setDebugInfo('GLTFLoader loaded, initializing scene...');

        if (!isMounted || !mountRef.current) return;

        const THREE = (window as any).THREE;
        if (!THREE || !THREE.GLTFLoader) {
          throw new Error('Three.js or GLTFLoader not available');
        }

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: true
        });
        renderer.setSize(80, 80);
        renderer.setClearColor(0x000000, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        setDebugInfo('Loading GLB model...');

        // Load GLB model
        const loader = new THREE.GLTFLoader();
        
        loader.load(
          '/horus.glb',
          (gltf: any) => {
            if (!isMounted) return;
            
            setDebugInfo('GLB loaded successfully!');
            const model = gltf.scene;
            modelRef.current = model;

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            model.position.sub(center);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.setScalar(scale);

            // Set material to white
            model.traverse((child: any) => {
              if (child.isMesh) {
                child.material = new THREE.MeshLambertMaterial({ 
                  color: 0xffffff,
                  transparent: true,
                  opacity: 0.9
                });
              }
            });

            scene.add(model);
            setIsLoaded(true);
            setDebugInfo('');
          },
          (progress: any) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setDebugInfo(`Loading: ${percent}%`);
          },
          (error: any) => {
            console.error('GLB loading error:', error);
            setDebugInfo(`GLB load error: ${error.message}`);
            createGeometricFallback(THREE, scene);
          }
        );

        mountRef.current.appendChild(renderer.domElement);

        // Animation loop
        const animate = () => {
          if (!isMounted) return;
          
          animationIdRef.current = requestAnimationFrame(animate);

          if (modelRef.current) {
            modelRef.current.rotation.x += 0.01;
          }

          renderer.render(scene, camera);
        };
        animate();

      } catch (error) {
        console.error('3D initialization error:', error);
        setDebugInfo(`Init error: ${error}`);
        createCSSFallback();
      }
    };

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const createGeometricFallback = (THREE: any, scene: any) => {
      const group = new THREE.Group();
      
      // Create a simple Horus eye
      const geometry = new THREE.SphereGeometry(0.8, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      group.add(sphere);
      
      modelRef.current = group;
      scene.add(group);
      setIsLoaded(true);
      setDebugInfo('');
    };

    const createCSSFallback = () => {
      setIsLoaded(true);
      setDebugInfo('');
    };

    initScene();

    return () => {
      isMounted = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovered(false);
    }
  };

  const handleTouch = () => {
    if (isMobile) {
      setHovered(true);
      setTimeout(() => setHovered(false), 300);
    }
  };

  // If no 3D content loaded, show CSS version
  if (isLoaded && !modelRef.current) {
    return (
      <div 
        className="logo-3d-container cursor-pointer relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch}
        style={{
          width: '80px',
          height: '80px',
          perspective: '1000px',
          transition: 'transform 0.2s ease-out'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'rotateX 4s linear infinite'
          }}
        >
          <div
            className="absolute inset-0 rounded-full border-2 border-white bg-transparent"
            style={{
              transform: 'rotateX(0deg) translateZ(20px)',
              opacity: 0.9
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full"
              style={{
                transform: 'translate(-50%, -50%)',
                opacity: 0.8
              }}
            />
          </div>
        </div>
        <style jsx>{`
          @keyframes rotateX {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="logo-3d-container cursor-pointer relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
      style={{
        width: '80px',
        height: '80px',
        opacity: isLoaded ? 1 : 0.3,
        transition: 'opacity 0.5s ease-in-out, transform 0.2s ease-out'
      }}
    >
      <div 
        ref={mountRef} 
        style={{
          width: '100%',
          height: '100%',
          transition: 'transform 0.2s ease-out'
        }}
      />
      
      {debugInfo && (
        <div className="absolute -bottom-8 left-0 text-xs text-white/60 whitespace-nowrap">
          {debugInfo}
        </div>
      )}
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Logo3D;
