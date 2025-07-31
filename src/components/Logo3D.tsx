import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useCursor } from '../context/CursorContext';

const Logo3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { setHovered, isMobile } = useCursor();

  useEffect(() => {
    if (!mountRef.current) return;

    let isMounted = true;

    const initScene = async () => {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        45,
        1, // aspect ratio 1:1 for square container
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(80, 80); // Small size for corner display
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      // Add subtle lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Try to dynamically import GLTFLoader
      try {
        // Use dynamic import for GLTFLoader
        const loaderModule = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/loaders/GLTFLoader.js');
        const GLTFLoader = loaderModule.GLTFLoader;
        
        const loader = new GLTFLoader();
        
        loader.load(
          '/horus.glb',
          (gltf: any) => {
            if (!isMounted) return;
            
            const model = gltf.scene;
            modelRef.current = model;

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Center the model
            model.position.sub(center);
            
            // Scale to fit nicely in the small container
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.setScalar(scale);

            // Set material properties for better visibility
            model.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                if (child.material) {
                  // Make it white to match the website theme
                  child.material = new THREE.MeshLambertMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.9
                  });
                }
              }
            });

            scene.add(model);
            setIsLoaded(true);
          },
          (progress: any) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
          },
          (error: any) => {
            console.error('Error loading 3D model:', error);
            if (isMounted) {
              setLoadError(true);
            }
          }
        );
      } catch (error) {
        console.error('Failed to load GLTFLoader:', error);
        if (isMounted) {
          setLoadError(true);
        }
        
        // Fallback: Create a simple geometric logo instead
        createFallbackLogo(scene);
      }

      if (mountRef.current && isMounted) {
        mountRef.current.appendChild(renderer.domElement);
      }

      // Animation loop
      const animate = () => {
        if (!isMounted) return;
        
        animationIdRef.current = requestAnimationFrame(animate);

        if (modelRef.current) {
          // Rotate on X-axis
          modelRef.current.rotation.x += 0.01;
        }

        renderer.render(scene, camera);
      };
      animate();
    };

    // Fallback geometric logo function
    const createFallbackLogo = (scene: THREE.Scene) => {
      const group = new THREE.Group();
      
      // Create a simple geometric representation (like a stylized eye)
      const geometry = new THREE.SphereGeometry(0.8, 16, 16);
      const material = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      
      // Add an inner circle for the "pupil"
      const innerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const innerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.8
      });
      const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
      innerSphere.position.z = 0.1;
      
      group.add(sphere);
      group.add(innerSphere);
      
      modelRef.current = group;
      scene.add(group);
      setIsLoaded(true);
    };

    initScene();

    // Cleanup function
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
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Handle mouse events for hover effect
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
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xs opacity-60">3D</div>
        </div>
      )}
    </div>
  );
};

export default Logo3D;
