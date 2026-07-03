import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

// --- INTERFACES ---
interface Film {
  title: string;
  year: string;
  image: string;
  description: string;
  gallery?: string[]; 
  team: { main: string[]; additional?: string[]; };
  link?: string;
  theme: { background: string; text: string; accent: string; };
  isComingSoon?: boolean;
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
const upcomingFilms: Film[] = [
  { 
    title: "NUIT BLANCHE", 
    year: "2025",
    image: "/images/films/nuit-blanche.jpg",
    gallery: ["/images/films/nuit-blanche.jpg", "/images/films/nuit-blanche2.jpg", "/images/films/nuit-blanche3.jpg", "/images/films/nuit-blanche4.jpg"],
    description: "Julien et Marie vont passer le week-end à la campagne, dans la maison de famille de Marie, où les attendent ses trois frères et sœurs. Tandis que les bouteilles défilent et que la soirée bat son plein, un drame se produit.",
    team: {
      main: ["Production : Horus Productions", "Coproduction : Studio Méricourt & Ulysse Arnal"],
      additional: ["Cast : Tess Lepreux-Alles, Philippe Bertrand, Elise De Gaudemaris, Alban Pellet, Stanislas Bizeu, Christelle Ribeiro", "Continuité : Carla De Almeida Pinto", "Lumière : Axel Peylet", "Image : Léo Lacan, assisté par Thibault Lienhardt", "Machinerie : Aristote Pham-Ba", "Maquillage : Marie Haegeman", "Musique : Pierre Bernier", "Post-production : Jonathan Le Borgne, Tristan Villeboux, Maxime Bardou", "Réalisation : Augustin Arnal, assisté par Justin Féral", "Régie : Jonah Webb, Alex Jourdan, Piotr", "Scénario : Augustin Arnal", "Son : Ancelin Audebert, Joffrey Duquenne, Mattias Thomas"]
    },
    theme: { background: "#ffffff", text: "#000000", accent: "#555555" }
  },
  { 
    title: "GUEULE D'ANGE", 
    year: "2025",
    image: "/images/films/gueule-dange.jpg",
    gallery: ["/images/films/gueule-dange.jpg", "/images/films/gueule-dange2.jpg", "/images/films/gueule-dange3.jpg"],
    description: "Lors d'un dîner mondain, Dorian perd un bout de sa lèvre. Il s'éclipse pour aller voir -Le Portrait- avec qui il semble partager un lien obscur et vital.",
    team: {
      main: ["Production : Horus Productions", "Réalisation & Scenario : Jonas Aragones"],
      additional: ["Cast : Adrien Aucouturier, Joel Grimaud, Capucine Denis, Melvil Termini, Eliott Manning, Naoufel Bas, Robin Calmels, Paula Carpenter", "Réalisation : Jonas Aragones, assisté par Gil Ingrand", "Maquillage : Candice Thro (SFX) et Elsa Desurvire, assistées par Alicia Yang et Jeanne Piffaut", "Continuité : Gena Lespert", "Régie : Nathan Deymié, assisté par Nils Archi et Pierre Moskvine", "Image : Marta Romanzo, assistée par Jonas Bellaiche et Jules Marchon", "Lumière : Kelyan Vignaux", "Décoration : Félix Spinosi, assisté par Jawel Coudert", "Costumes : Violette Novat, assistée par Lilou Thibaut", "Son : Louis Slabiak, mixage de Joseph-Etienne Cercueus", "Graphisme : Siloé Ralite", "Photographe de plateau : Suzanne Gautier"]
    },
    theme: { background: "#f0efed", text: "#1a1a1a", accent: "#757575" }
  },
  {
    title: "PRESQUE JAUNE",
    year: "2026",
    image: "", 
    description: "En cours de post-production.",
    team: { main: ["Production : Horus Productions"] },
    theme: { background: "#000000", text: "#ffffff", accent: "#ffffff" },
    isComingSoon: true 
  }
];

const pastFilms: Film[] = [
  { 
    title: "QISHUI PAPITEDDYBEAR\nFEAT PENSE", 
    year: "2024",
    image: "/images/films/qishui.jpg",
    description: "QISHUI 1er extrait de LA CHAUFFE, EP commun entre PAPI TEDDY BEAR et PenseMusic‬",
    team: { main: ["Production : Horus Productions", "Son : Papiteddybear & Pense", "Image : Gabhus"] },
    link: "https://www.youtube.com/watch?v=J_wA4imVTlg",
    theme: { background: "#d8e1e8", text: "#1a2a38", accent: "#7096b8" }
  },
  { 
    title: "CONVICTION ELIAS LCS", 
    year: "2026",
    image: "/images/films/conviction.jpg",
    description: "CONVICTION, clip du son, déjà disponible sur toutes les plateformes",
    team: { main: ["Production : Horus Productions", "Son : Elias LCS", "Image : Gabhus, Matias, Marta & Leila"] },
    link: "https://www.youtube.com/watch?v=xTUR0E_gmVU",
    theme: { background: "#121212", text: "#ffffff", accent: "#555555" }
  }
];

// --- MAIN COMPONENT ---
const Films: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setHovered, isMobile } = useCursor();
  
  // MODIF 4: Trier les films disponibles par ordre chronologique décroissant (plus récent au plus ancien)
  const navigableFilms = useMemo(() => {
    return [...upcomingFilms, ...pastFilms]
      .filter(f => !f.isComingSoon)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  
  const touchStartY = useRef(0);
  const isTransitioningRef = useRef(false);

  const activeFilm = navigableFilms[currentIndex];

  // --- INITIALIZATION ---
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    window.scrollTo(0, 0);
    
    // Déterminer le film de départ selon le state de la landing
    const targetTitle = location.state?.targetFilm;
    if (targetTitle) {
      const idx = navigableFilms.findIndex(f => f.title === targetTitle);
      if (idx !== -1) setCurrentIndex(idx);
    }
    
    ImageLoader.preloadImages(navigableFilms.map(f => f.image).filter(img => img !== ""));
  }, [location.state, navigableFilms]);

  // --- IMAGE LOADING EFFECT ---
  useEffect(() => {
    if (!activeFilm) return;
    setCurrentImageIndex(0);
    setIsImageLoading(true);
    ImageLoader.loadImage(activeFilm.image, 'high')
      .then(() => setIsImageLoading(false))
      .catch(() => setIsImageLoading(false));
  }, [currentIndex, activeFilm]);

  // --- SCROLL NAVIGATION LOGIC (Modif 4) ---
  const goToFilm = useCallback((directionOrIndex: 'next' | 'prev' | number) => {
    if (isTransitioningRef.current || isLightboxOpen) return;
    
    setCurrentIndex(prev => {
      let nextIndex = prev;
      if (directionOrIndex === 'next') nextIndex = prev + 1;
      else if (directionOrIndex === 'prev') nextIndex = prev - 1;
      else nextIndex = directionOrIndex as number;

      // Stop aux limites (pas de boucle infinie)
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= navigableFilms.length) nextIndex = navigableFilms.length - 1;

      if (nextIndex !== prev) {
        isTransitioningRef.current = true;
        setExpandedTeam(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Cooldown pour éviter le scroll hyper-rapide
        setTimeout(() => { isTransitioningRef.current = false; }, 1200); 
      }
      return nextIndex;
    });
  }, [isLightboxOpen, navigableFilms.length]);

  // Écoute de la molette pour PC
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isLightboxOpen || isTransitioningRef.current) return;
      // Scroll uniquement si l'intensité est suffisante
      if (e.deltaY > 50) goToFilm('next');
      else if (e.deltaY < -50) goToFilm('prev');
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToFilm, isLightboxOpen]);

  // Écoute du tactile pour Mobile (Swipe up / down)
  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isLightboxOpen || isTransitioningRef.current) return;
    const touchEndY = e.changedTouches[0].clientY;
    const delta = touchStartY.current - touchEndY;
    if (delta > 80) goToFilm('next');
    else if (delta < -80) goToFilm('prev');
  };

  // --- KEYBOARD & ACTIONS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { isLightboxOpen ? closeLightbox() : navigate('/'); }
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowDown') goToFilm('next');
      else if (e.key === 'ArrowUp') goToFilm('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeFilm, currentImageIndex, goToFilm, navigate]);

  const toggleTeamExpansion = (filmTitle: string) => setExpandedTeam(prev => prev === filmTitle ? null : filmTitle);
  const handleLinkClick = (film: Film) => film.link && window.open(film.link, '_blank');
  
  const nextImage = () => { if (activeFilm?.gallery) setCurrentImageIndex(p => (p + 1) % activeFilm.gallery!.length); };
  const prevImage = () => { if (activeFilm?.gallery) setCurrentImageIndex(p => (p - 1 + activeFilm.gallery!.length) % activeFilm.gallery!.length); };
  const openLightbox = () => { if (activeFilm?.gallery?.length) setIsLightboxOpen(true); };
  const closeLightbox = () => setIsLightboxOpen(false);

  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    if (offset.x * velocity.x < -10000) nextImage();
    else if (offset.x * velocity.x > 10000) prevImage();
  };

  if (!activeFilm) return null;
  const currentImageSrc = activeFilm.gallery ? activeFilm.gallery[currentImageIndex] : activeFilm.image;

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen w-full flex flex-col relative overflow-x-hidden"
      // MODIF 3: Opacité initiale à 0 pour fondre par-dessus l'accueil
      initial={{ opacity: 0, backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: activeFilm.theme.background,
        color: activeFilm.theme.text,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 p-4 md:p-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto"><HomeLink /></div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={() => navigate('/')}
            className="pointer-events-auto text-sm md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity"
            style={{ color: activeFilm.theme.text }}
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      {/* --- MODIF 4 : FRISE CHRONOLOGIQUE VERTICALE --- */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-40 pointer-events-none md:pointer-events-auto">
        {navigableFilms.map((film, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={film.title}
              onClick={() => goToFilm(idx)}
              className="flex items-center justify-end gap-3 cursor-pointer group pointer-events-auto"
            >
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.span
                    key="title"
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                    className="text-xs md:text-sm font-bold tracking-widest uppercase whitespace-nowrap"
                    style={{ color: activeFilm.theme.text }}
                  >
                    {film.title}
                  </motion.span>
                ) : (
                  <motion.span
                    key="year"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} whileHover={{ opacity: 0.8 }}
                    className="text-[10px] md:text-xs font-light tracking-widest whitespace-nowrap hidden md:block transition-opacity"
                    style={{ color: activeFilm.theme.text }}
                  >
                    {film.year}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.div
                animate={{ 
                  height: isActive ? 32 : 6, 
                  opacity: isActive ? 1 : 0.3 
                }}
                className="w-1.5 md:w-2 rounded-full bg-current transition-all duration-500 origin-center"
                style={{ color: activeFilm.theme.text }}
              />
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col pt-24 pb-12 px-4 md:px-8 min-h-screen justify-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilm.title} // MODIF 3: Changement de clé pour crossfade entre les projets
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full flex flex-col items-center pb-20"
          >
            <div className="w-full text-center mb-8 md:mb-12">
               <h1 className="text-3xl md:text-6xl font-light tracking-widest uppercase mb-2 whitespace-pre-line">{activeFilm.title}</h1>
               <p className="text-sm md:text-lg opacity-60 tracking-wide">{activeFilm.year}</p>
            </div>

            <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center max-w-6xl pl-0 lg:pr-16">
              {/* LEFT (Image) */}
              <div className="w-full lg:w-2/3 relative">
                {isImageLoading ? (
                  <div className="aspect-video w-full bg-black/10 animate-pulse rounded-sm flex items-center justify-center">
                     <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="relative w-full aspect-video overflow-hidden rounded-sm group select-none">
                    <motion.img 
                      key={currentImageIndex} src={currentImageSrc} alt={activeFilm.title}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                      drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd}
                      onClick={openLightbox}
                      className="w-full h-full object-cover cursor-grab active:cursor-grabbing touch-pan-y"
                    />
                    {activeFilm.gallery && activeFilm.gallery.length > 1 && (
                      <>
                         <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" onClick={(e) => {e.stopPropagation(); prevImage();}}>←</button>
                         <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" onClick={(e) => {e.stopPropagation(); nextImage();}}>→</button>
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                         {activeFilm.gallery.map((_, idx) => (
                           <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                         ))}
                         </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT (Info) */}
              <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Synopsis</h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-90 text-justify">{activeFilm.description}</p>
                  {activeFilm.link && (
                    <div className="mt-4"><button onClick={() => handleLinkClick(activeFilm)} className="text-sm border-b border-current pb-0.5 hover:opacity-50 transition-opacity">Voir le projet ↗</button></div>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Crédits</h3>
                  <div className="space-y-1.5">
                     {activeFilm.team.main.map((member, index) => {
                        const [role, name] = member.split(' : ');
                        return (<p key={index} className="text-sm leading-relaxed"><span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span></p>);
                     })}
                     {activeFilm.team.additional && (
                       <>
                           <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedTeam === activeFilm.title ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                             <div className="space-y-1.5 pt-2 border-t border-black/10 dark:border-white/10">
                                {activeFilm.team.additional.map((member, index) => {
                                   const [role, name] = member.split(' : ');
                                   return (<p key={index} className="text-sm leading-relaxed"><span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span></p>);
                                })}
                             </div>
                           </div>
                           <button onClick={() => toggleTeamExpansion(activeFilm.title)} className="text-xs opacity-50 hover:opacity-100 mt-2 underline decoration-dotted underline-offset-4">
                             {expandedTeam === activeFilm.title ? '- Réduire les crédits' : '+ Tous les crédits'}
                           </button>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && activeFilm && activeFilm.gallery && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-50">✕</button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentImageIndex} src={activeFilm.gallery[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={handleDragEnd}
                className="max-w-[95%] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing shadow-2xl"
              />
               <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); prevImage();}}>❮</button>
               <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); nextImage();}}>❯</button>
            </div>
             <div className="absolute bottom-6 text-white/40 text-sm tracking-widest pointer-events-none">{currentImageIndex + 1} / {activeFilm.gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Films;
