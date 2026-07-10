import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

// --- INTERFACES ---
interface CommercialProject {
  title: string;
  client: string;
  year: string;
  reelUrl: string;
  gallery?: string[]; 
  description: string;
  services: string[];
  team: { main: string[]; additional?: string[]; };
  link?: string;
  theme: { background: string; text: string; accent: string; };
}

// --- UTILITIES ---
class ImageLoader {
  private static cache = new Map<string, HTMLImageElement>();
  private static loadingPromises = new Map<string, Promise<HTMLImageElement>>();
  
  static async loadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<HTMLImageElement> {
    if (!src) return Promise.reject("No source provided"); 
    if (this.cache.has(src)) return this.cache.get(src)!;
    if (this.loadingPromises.has(src)) return this.loadingPromises.get(src)!;
    
    const loadingPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const cleanup = () => this.loadingPromises.delete(src);
      img.onload = () => { this.cache.set(src, img); cleanup(); resolve(img); };
      img.onerror = () => { cleanup(); reject(new Error(`Failed to load image: ${src}`)); };
      img.decoding = 'async';
      img.loading = 'eager';
      if (priority === 'high' && 'fetchPriority' in img) { (img as any).fetchPriority = 'high'; }
      img.src = src;
    });
    
    this.loadingPromises.set(src, loadingPromise);
    return loadingPromise;
  }
  
  static preloadImages(sources: string[]) {
    sources.forEach((src, index) => {
      if (src) this.loadImage(src, index === 0 ? 'high' : 'low').catch(() => console.warn(`Failed to preload: ${src}`));
    });
  }
}

// --- DATA ---
const commercialProjects: CommercialProject[] = [
  { 
    title: "MIAM MIAM MIAM", 
    client: "Food Truck", 
    year: "2026", 
    reelUrl: "https://www.instagram.com/p/DaLSErCpMZk", 
    gallery: [
      // Mets tes vraies photos dans le dossier public/images/pub/
      "/images/pub/miam-1.jpg", 
      "/images/pub/miam-2.jpg",
      "/images/pub/miam-3.jpg"
    ],
    description: "Campagne de communication digitale pour mettre en avant le savoir-faire et les produits du Food Truck. Un format dynamique et gourmand pensé spécifiquement pour les réseaux sociaux.",
    services: [
      "Réalisation de Reel Instagram (Format 9:16)",
      "Shooting photo culinaire et lifestyle",
      "Montage, étalonnage et sound design"
    ],
    team: {
      main: [
        "Production : Horus Productions", 
        "Réalisation : Jonas Aragones (@j.onas____)"
      ],
      // Tu peux ajouter d'autres personnes ici si besoin, elles s'afficheront directement à la suite
      additional: [] 
    }, 
    theme: { background: "#e8e5df", text: "#1a1a1a", accent: "#d35400" }
  },
  // Ajoute tes futures pubs ici...
];

// --- MAIN COMPONENT ---
const Commercial: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setHovered, isMobile } = useCursor();
  
  const navigableProjects = useMemo(() => commercialProjects, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [isExiting, setIsExiting] = useState(false);
  
  const touchStartY = useRef(0);
  const isTransitioningRef = useRef(false);

  const activeProject = navigableProjects[currentIndex];

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    window.scrollTo(0, 0);
    
    if (activeProject?.gallery) {
        ImageLoader.preloadImages(activeProject.gallery);
    }
  }, [activeProject]);

  const goToProject = useCallback((directionOrIndex: 'next' | 'prev' | number) => {
    if (isTransitioningRef.current || isLightboxOpen) return;
    
    setCurrentIndex(prev => {
      let nextIndex = prev;
      if (directionOrIndex === 'next') nextIndex = prev + 1;
      else if (directionOrIndex === 'prev') nextIndex = prev - 1;
      else nextIndex = directionOrIndex as number;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= navigableProjects.length) nextIndex = navigableProjects.length - 1;

      if (nextIndex !== prev) {
        isTransitioningRef.current = true;
        setCurrentImageIndex(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => { isTransitioningRef.current = false; }, 1200); 
      }
      return nextIndex;
    });
  }, [isLightboxOpen, navigableProjects.length]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isLightboxOpen || isTransitioningRef.current) return;
      if (e.deltaY > 50) goToProject('next');
      else if (e.deltaY < -50) goToProject('prev');
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToProject, isLightboxOpen]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isLightboxOpen || isTransitioningRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY.current - touchEndY;
    if (delta > 80) goToProject('next');
    else if (delta < -80) goToProject('prev');
  };

  const handleBackToHome = useCallback(() => {
    if (isLightboxOpen) { closeLightbox(); return; }
    setIsExiting(true);
    setTimeout(() => navigate('/'), 600);
  }, [isLightboxOpen, navigate]);

  const handleLinkClick = (project: CommercialProject) => project.link && window.open(project.link, '_blank');
  
  const nextImage = () => { if (activeProject?.gallery) setCurrentImageIndex(p => (p + 1) % activeProject.gallery!.length); };
  const prevImage = () => { if (activeProject?.gallery) setCurrentImageIndex(p => (p - 1 + activeProject.gallery!.length) % activeProject.gallery!.length); };
  const openLightbox = () => { if (activeProject?.gallery?.length) setIsLightboxOpen(true); };
  const closeLightbox = () => setIsLightboxOpen(false);
  
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    if (offset.x * velocity.x < -10000) nextImage();
    else if (offset.x * velocity.x > 10000) prevImage();
  };

  if (!activeProject) return null;

  const getEmbedUrl = (url: string) => {
      const cleanUrl = url.split('?')[0];
      return cleanUrl.endsWith('/') ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
  };

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full flex flex-col relative overflow-x-hidden"
      initial={{ opacity: 0, backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: isExiting ? 'transparent' : activeProject.theme.background,
        color: activeProject.theme.text,
        opacity: isExiting ? 0 : 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto"><HomeLink /></div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={handleBackToHome}
            className="pointer-events-auto text-sm md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ color: activeProject.theme.text }}
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-40 pointer-events-none md:pointer-events-auto">
        {navigableProjects.map((project, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={project.title}
              onClick={() => goToProject(idx)}
              className="flex items-center justify-end gap-3 cursor-pointer group pointer-events-auto"
            >
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[10px] md:text-xs font-bold tracking-widest uppercase whitespace-nowrap origin-right"
                style={{ color: activeProject.theme.text }}
              >
                {project.title}
              </motion.span>
              <motion.div
                animate={{ height: isActive ? 32 : 6, opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-1.5 md:w-2 rounded-full bg-current origin-center"
                style={{ color: activeProject.theme.text }}
              />
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col pt-24 pb-12 px-4 md:px-8 min-h-screen justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.title}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col items-center pb-20"
          >
            <div className="w-full text-center mb-8 md:mb-12">
               <h1 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-2 whitespace-pre-line">{activeProject.title}</h1>
               <p className="text-sm md:text-lg opacity-60 tracking-wide">{activeProject.client} — {activeProject.year}</p>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center max-w-6xl pl-0 lg:pr-16">
              
              <div className="w-full lg:w-2/3 flex flex-col sm:flex-row gap-4 h-[60vh] sm:h-[70vh]">
                {activeProject.reelUrl && (
                    <div className="w-full sm:w-[320px] md:w-[350px] h-full flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-black/5">
                        <iframe 
                            src={getEmbedUrl(activeProject.reelUrl)} 
                            className="w-full h-full border-none" 
                            scrolling="no" 
                            allowTransparency={true} 
                            allow="encrypted-media"
                        />
                    </div>
                )}

                {activeProject.gallery && activeProject.gallery.length > 0 && (
                    <div className="relative flex-grow h-full overflow-hidden rounded-lg shadow-lg group select-none bg-black/5">
                        <motion.img 
                            key={currentImageIndex} 
                            src={activeProject.gallery[currentImageIndex]} 
                            alt={`${activeProject.title} photo`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd}
                            onClick={openLightbox}
                            className="w-full h-full object-cover cursor-grab active:cursor-grabbing touch-pan-y"
                        />
                        {activeProject.gallery.length > 1 && (
                            <>
                                <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" onClick={(e) => {e.stopPropagation(); prevImage();}}>←</button>
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" onClick={(e) => {e.stopPropagation(); nextImage();}}>→</button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {activeProject.gallery.map((_, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                                ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
              </div>

              <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Prestations</h3>
                  <ul className="list-disc list-inside text-sm md:text-base leading-relaxed opacity-90 mb-6 space-y-1">
                      {activeProject.services.map((service, index) => (
                          <li key={index}>{service}</li>
                      ))}
                  </ul>

                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Le Projet</h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-90 text-justify">{activeProject.description}</p>
                  
                  {activeProject.link && (
                    <div className="mt-4"><button onClick={() => handleLinkClick(activeProject)} className="text-sm border-b border-current pb-0.5 hover:opacity-50 transition-opacity">Voir plus ↗</button></div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Crédits</h3>
                  <div className="space-y-1.5">
                     {/* Affichage direct de tous les crédits sans bouton */}
                     {activeProject.team.main.map((member, index) => {
                        const [role, name] = member.split(' : ');
                        return (<p key={`main-${index}`} className="text-sm leading-relaxed"><span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span></p>);
                     })}
                     {activeProject.team.additional && activeProject.team.additional.map((member, index) => {
                        const [role, name] = member.split(' : ');
                        return (<p key={`add-${index}`} className="text-sm leading-relaxed"><span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span></p>);
                     })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isLightboxOpen && activeProject && activeProject.gallery && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-50">✕</button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentImageIndex} src={activeProject.gallery[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={handleDragEnd}
                className="max-w-[95%] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing shadow-2xl"
              />
               <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); prevImage();}}>❮</button>
               <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); nextImage();}}>❯</button>
            </div>
             <div className="absolute bottom-6 text-white/40 text-sm tracking-widest pointer-events-none">{currentImageIndex + 1} / {activeProject.gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Commercial;
