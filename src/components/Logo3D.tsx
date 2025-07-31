import React, { useRef, useEffect, useState } from 'react';
import { useCursor } from '../context/CursorContext';

const Logo3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { setHovered, isMobile } = useCursor();

  useEffect(() => {
    let isMounted = true;

    const initScene = async () => {
      try {
        // Load Three.js from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
        
        // Load GLTFLoader from CDN
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js');

        if (!isMounted || !mountRef.current) return;

        const THREE = (window as any).THREE;
        if (!THREE || !THREE.GLTFLoader) {
          throw new Error('Three.js or GLTFLoader not loaded');
        }

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        });
        renderer.setSize(80, 80);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load GLB model
        const loader = new THREE.GLTFLoader();
        
        loader.load(
          '/horus.glb',
          (gltf: any) => {
            if (!isMounted) return;
            
            console.log('GLB loaded successfully:', gltf);
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
          },
          (progress: any) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
          },
          (error: any) => {
            console.error('Error loading GLB:', error);
            if (isMounted) {
              setLoadError(true);
              createFallbackLogo(THREE, scene);
            }
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
        console.error('Failed to initialize 3D scene:', error);
        if (isMounted) {
          setLoadError(true);
          setIsLoaded(true); // Show the fallback
        }
      }
    };

    // Helper function to load scripts
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
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

    // Fallback geometric logo
    const createFallbackLogo = (THREE: any, scene: any) => {
      const group = new THREE.Group();
      
      // Create Horus eye-like shape
      const outerGeometry = new THREE.RingGeometry(0.5, 0.8, 16);
      const outerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const outerRing = new THREE.Mesh(outerGeometry, outerMaterial);
      
      const innerGeometry = new THREE.CircleGeometry(0.3, 16);
      const innerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      const innerCircle = new THREE.Mesh(innerGeometry, innerMaterial);
      innerCircle.position.z = 0.01;
      
      // Add a small pupil
      const pupilGeometry = new THREE.CircleGeometry(0.1, 8);
      const pupilMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.8
      });
      const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      pupil.position.z = 0.02;
      
      group.add(outerRing);
      group.add(innerCircle);
      group.add(pupil);
      
      modelRef.current = group;
      scene.add(group);
      setIsLoaded(true);
    };

    initScene();

    return () => {
      isMounted = false;
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Element might have already been removed
        }
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Clean up geometries and materials
      if (sceneRef.current) {
        sceneRef.current.traverse((object: any) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
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
      onMouseOver={() => {
        if (mountRef.current) {
          mountRef.current.style.transform = 'scale(1.1)';
        }
      }}
      onMouseOut={() => {
        if (mountRef.current) {
          mountRef.current.style.transform = 'scale(1)';
        }
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
      
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Logo3D;
