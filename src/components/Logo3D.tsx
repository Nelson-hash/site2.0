import React, { useRef, useEffect, useState } from 'react';
import { useCursor } from '../context/CursorContext';

const Logo3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const modelRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { setHovered, isMobile } = useCursor();

  useEffect(() => {
    let isMounted = true;

    const initScene = async () => {
      try {
        setDebugInfo('Checking GLB file...');
        
        // Check if GLB file exists with better error handling
        try {
          const response = await fetch('/horus.glb', { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          
          if (!response.ok) {
            throw new Error(`GLB file not found: HTTP ${response.status}`);
          }
          
          console.log('✅ GLB file found, size:', response.headers.get('content-length'));
          setDebugInfo('GLB file found, loading Three.js...');
        } catch (fetchError) {
          console.error('❌ GLB file check failed:', fetchError);
          setDebugInfo('GLB file not accessible, using fallback');
          createCSSFallback();
          return;
        }

        // Load Three.js with better error handling
        try {
          setDebugInfo('Loading Three.js...');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
          
          if (!(window as any).THREE) {
            throw new Error('Three.js failed to load');
          }
          
          console.log('✅ Three.js loaded');
          setDebugInfo('Loading GLTFLoader...');
          
          // Try modern GLTFLoader first
          try {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js');
          } catch {
            // Fallback to alternative GLTFLoader
            await loadScript('https://threejs.org/examples/js/loaders/GLTFLoader.js');
          }
          
          if (!(window as any).THREE.GLTFLoader) {
            throw new Error('GLTFLoader failed to load');
          }
          
          console.log('✅ GLTFLoader loaded');
          setDebugInfo('Initializing 3D scene...');
          
        } catch (scriptError) {
          console.error('❌ Script loading failed:', scriptError);
          setDebugInfo('Failed to load 3D libraries, using fallback');
          createCSSFallback();
          return;
        }

        if (!isMounted || !mountRef.current) return;

        const THREE = (window as any).THREE;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ 
          alpha: true,
          antialias: window.devicePixelRatio <= 1,
          powerPreference: "high-performance"
        });
        renderer.setSize(80, 80);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;

        // Better lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight1.position.set(2, 2, 2);
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight2.position.set(-1, -1, 1);
        scene.add(directionalLight2);

        setDebugInfo('Loading GLB model...');

        // Load GLB model with timeout
        const loader = new THREE.GLTFLoader();
        let loadTimeout: NodeJS.Timeout;
        
        const loadPromise = new Promise((resolve, reject) => {
          loadTimeout = setTimeout(() => {
            reject(new Error('GLB loading timeout'));
          }, 10000); // 10 second timeout
          
          loader.load(
            '/horus.glb',
            (gltf: any) => {
              clearTimeout(loadTimeout);
              resolve(gltf);
            },
            (progress: any) => {
              if (progress.total > 0) {
                const percent = Math.round((progress.loaded / progress.total) * 100);
                setDebugInfo(`Loading GLB: ${percent}%`);
                console.log(`📦 Loading progress: ${percent}%`);
              }
            },
            (error: any) => {
              clearTimeout(loadTimeout);
              reject(error);
            }
          );
        });

        try {
          const gltf = await loadPromise;
          
          if (!isMounted) return;
          
          console.log('✅ GLB loaded successfully:', gltf);
          setDebugInfo('Processing model...');
          
          const model = (gltf as any).scene;
          modelRef.current = model;

          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Center the model
          model.position.sub(center);
          
          // Scale to fit nicely
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const scale = 1.5 / maxDim; // Slightly smaller scale
            model.scale.setScalar(scale);
          }

          // Process materials
          let materialCount = 0;
          model.traverse((child: any) => {
            if (child.isMesh && child.material) {
              materialCount++;
              
              // Keep original material but ensure it's visible
              if (child.material.color) {
                child.material.color.setHex(0xffffff);
              }
              
              // Ensure proper opacity
              child.material.transparent = true;
              child.material.opacity = 0.95;
              
              // Add some metalness for better visibility
              if (child.material.metalness !== undefined) {
                child.material.metalness = 0.1;
                child.material.roughness = 0.3;
              }
            }
          });
          
          console.log(`🎨 Processed ${materialCount} materials`);

          scene.add(model);
          mountRef.current.appendChild(renderer.domElement);
          
          setUse3D(true);
          setIsLoaded(true);
          setDebugInfo('');
          
          console.log('🎉 3D logo ready!');
          
        } catch (loadError) {
          console.error('❌ GLB loading failed:', loadError);
          setDebugInfo(`GLB load failed: ${loadError.message}`);
          
          // Create geometric fallback in 3D
          createGeometric3DFallback(THREE, scene);
          mountRef.current.appendChild(renderer.domElement);
          setUse3D(true);
          setIsLoaded(true);
          setDebugInfo('');
        }

        // Animation loop
        const animate = () => {
          if (!isMounted) return;
          
          animationIdRef.current = requestAnimationFrame(animate);

          if (modelRef.current) {
            // Y-axis rotation as requested
            modelRef.current.rotation.y += 0.01;
          }

          if (rendererRef.current && sceneRef.current) {
            rendererRef.current.render(sceneRef.current, camera);
          }
        };
        animate();

      } catch (error) {
        console.error('❌ 3D initialization failed:', error);
        setDebugInfo(`3D init failed: ${error}`);
        createCSSFallback();
      }
    };

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          // Add small delay to ensure script is fully parsed
          setTimeout(resolve, 100);
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const createGeometric3DFallback = (THREE: any, scene: any) => {
      console.log('🔄 Creating 3D geometric fallback');
      
      const group = new THREE.Group();
      
      // Create a more detailed Horus eye shape
      const outerGeometry = new THREE.TorusGeometry(0.6, 0.2, 8, 16);
      const outerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9
      });
      const outerTorus = new THREE.Mesh(outerGeometry, outerMaterial);
      outerTorus.rotation.x = Math.PI / 2;
      
      const innerGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const innerMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
      });
      const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
      
      const pupilGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      const pupilMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.9
      });
      const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      pupil.position.z = 0.1;
      
      group.add(outerTorus);
      group.add(innerSphere);
      group.add(pupil);
      
      modelRef.current = group;
      scene.add(group);
    };

    const createCSSFallback = () => {
      console.log('🎨 Using CSS fallback');
      setIsLoaded(true);
      setDebugInfo('');
    };

    initScene();

    return () => {
      isMounted = false;
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Cleanup 3D resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
        
        if (mountRef.current && rendererRef.current.domElement) {
          try {
            mountRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            // Element might already be removed
          }
        }
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object: any) => {
          if (object.isMesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat: any) => mat.dispose());
              } else {
                object.material.dispose();
              }
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

  // CSS Fallback component with Y-axis rotation
  if (isLoaded && !use3D) {
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
            animation: 'rotateY 4s linear infinite' // Changed to Y-axis
          }}
        >
          <div
            className="absolute inset-0 rounded-full border-2 border-white bg-transparent"
            style={{
              transform: 'rotateY(0deg) translateZ(20px)',
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
          <div
            className="absolute inset-2 rounded-full border border-white opacity-60"
            style={{
              transform: 'rotateY(45deg) translateZ(10px)'
            }}
          />
          <div
            className="absolute inset-4 rounded-full border border-white opacity-40"
            style={{
              transform: 'rotateY(90deg) translateZ(5px)'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes rotateY {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
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
      onMouseOver={() => {
        if (mountRef.current && use3D) {
          mountRef.current.style.transform = 'scale(1.1)';
        }
      }}
      onMouseOut={() => {
        if (mountRef.current && use3D) {
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
      
      {debugInfo && (
        <div className="absolute -bottom-6 left-0 text-xs text-white/60 whitespace-nowrap z-50">
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
