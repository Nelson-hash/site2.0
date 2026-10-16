import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

// --- INTERFACES ---
interface CommercialProject {
  title: string;
  client: string;
  year: string;
  reelUrl?: string;
  heroImages: string[];      
  verticalImages: string[];  
  videos?: { left: string; right: string; logo: string };
  description: string;
  services: string[];
  team: { main: string[]; additional?: string[]; };
  link?: string;
  theme: { background: string; text: string; accent: string; };
}

// --- DATA ---
const commercialProjects: CommercialProject[] = [
  { 
    title: "MIAM MIAM MIAM", 
    client: "Photos et vidéos pour une marque de restauration", 
    year: "2026", 
    heroImages: [
      "images/pub/4.jpg",
      "images/pub/5.jpg" 
    ],
    verticalImages: [
      "images/pub/7.jpg",
      "images/pub/8.jpg",
      "images/pub/9.jpg"
    ],
    videos: {
      left: "videos/video-gauche.mp4",
      right: "videos/video-droite.mp4",
      logo: "images/pub/Miam-Logo.png"
    },
    description: "Campagne de communication digitale pour mettre en avant le savoir-faire et les produits du Food Truck. Un format dynamique pensé spécifiquement pour les réseaux sociaux.",
    services: [
      "Réalisation de Reels Instagram (Format 9:16)",
      "Shooting photo culinaire et d'atmosphères",
      "Montage, étalonnage et sound design"
    ],
    team: {
      main: [
        "Production : Horus Productions", 
        "Réalisation : Jonas Aragones (@j.onas____)"
      ],
      additional: [] 
    }, 
    theme: { background: "#e8e5df", text: "#1a1a1a", accent: "#d35400" }
  }
];

// --- MISE EN CACHE DES IMAGES ---
const preloadImages = () => {
  commercialProjects.forEach(project => {
    const imgs = [...project.heroImages, ...project.verticalImages];
    if (project.videos?.logo) imgs.push(project.videos.logo);
    imgs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  });
};

// --- MAIN COMPONENT ---
const Commercial: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useCursor();
  const navigableProjects = useMemo(() => commercialProjects, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); 
  const [isExiting, setIsExiting] = useState(false);

  const activeProject = navigableProjects[currentIndex];

  const allImages = useMemo(() => {
    if (!activeProject) return [];
    return [...activeProject.heroImages, ...activeProject.verticalImages];
  }, [activeProject]);

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
  }, [isLightboxOpen, activeProject]);

  const goToProject = useCallback((index: number) => {
    if (isLightboxOpen || index === currentIndex) return;
    if (index >= 0 && index < navigableProjects.length) {
      setCurrentIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isLightboxOpen, currentIndex, navigableProjects.length]);

  const handleBackToHome = useCallback(() => {
    if (isLightboxOpen) { closeLightbox(); return; }
    setIsExiting(true);
    setTimeout(() => navigate('/'), 600);
  }, [isLightboxOpen, navigate]);

  const handleLinkClick = (project: CommercialProject) => project.link && window.open(project.link, '_blank');
  
  // Fonctions Lightbox
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const nextImage = () => setCurrentImageIndex(p => (p + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex(p => (p - 1 + allImages.length) % allImages.length);
  
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    if (offset.x * velocity.x < -10000) nextImage();
    else if (offset.x * velocity.x > 10000) prevImage();
  };

  if (!activeProject) return null;

  return (
    <motion.div
      className="min-h-screen w-full flex flex-col relative overflow-x-hidden"
      initial={{ opacity: 0, backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: isExiting ? 'transparent' : activeProject.theme.background,
        color: activeProject.theme.text,
        opacity: isExiting ? 0 : 1,
        transition: { duration: 0.6, ease: "easeOut" }
      }}
    >
      {/* HEADER FIXE */}
      <div className="fixed top-0 left-0 right-0 z-30 px-5 py-4 md:p-8 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto"><HomeLink /></div>
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            onClick={handleBackToHome}
            className="pointer-events-auto text-xs md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity bg-white/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none px-3 py-1.5 md:p-0 rounded-full"
            style={{ color: activeProject.theme.text }}
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>
      
      {/* FRISE DE NAVIGATION (Texte masqué sur mobile pour ne pas gêner la lecture) */}
      <div className="fixed right-2.5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-40 pointer-events-auto">
        {navigableProjects.map((project, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div key={project.title} onClick={() => goToProject(idx)} className="flex items-center justify-end gap-3 cursor-pointer group">
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:block text-xs font-bold tracking-widest uppercase whitespace-nowrap origin-right"
                style={{ color: activeProject.theme.text }}
              >
                {project.title}
              </motion.span>
              <motion.div
                animate={{ height: isActive ? 32 : 6, opacity: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-1 md:w-2 rounded-full bg-current origin-center group-hover:opacity-80"
                style={{ color: activeProject.theme.text }}
              />
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.title}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col pb-16 md:pb-24"
        >
          {/* TITRE PROJET */}
          <div className="w-full text-center mt-20 md:mt-24 mb-8 md:mb-12 px-5">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase mb-2 whitespace-pre-line">
              {activeProject.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-lg opacity-60 tracking-wide">
              {activeProject.client} — {activeProject.year}
            </p>
          </div>

          {/* SECTION 1 : Deux grandes photos 16:9 */}
          <div className="w-full px-4 md:px-8 mb-12 md:mb-24 h-auto md:h-[75vh] flex flex-col md:flex-row gap-4">
            {activeProject.heroImages.map((img, idx) => (
              <div 
                key={`hero-${idx}`} 
                onClick={() => openLightbox(idx)}
                className="w-full md:w-1/2 aspect-[16/10] md:aspect-auto md:h-full rounded-xl overflow-hidden shadow-lg bg-black/5 cursor-pointer group"
              >
                <img src={img} alt="Hero" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            ))}
          </div>

          {/* SECTION 2 : 3 photos 9:16 (Slider tactile sur mobile / Grille sur PC) + Textes */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start mb-16 md:mb-28">
            
            {/* Colonne de gauche : Carrousel horizontal sur mobile, Grille 3 colonnes dès tablette */}
            <div className="w-full lg:w-3/5 flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 no-scrollbar">
              {activeProject.verticalImages.map((img, idx) => (
                <div 
                  key={`vert-${idx}`} 
                  onClick={() => openLightbox(activeProject.heroImages.length + idx)}
                  className="w-[78%] sm:w-full flex-shrink-0 snap-center aspect-[9/16] rounded-xl overflow-hidden shadow-lg bg-black/5 cursor-pointer group"
                >
                  <img src={img} alt="Vertical" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              ))}
            </div>

            {/* Colonne de droite : Textes */}
            <div className="w-full lg:w-2/5 flex flex-col gap-6 md:gap-8 lg:sticky lg:top-32 px-1 sm:px-0">
              <div>
                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest opacity-40 mb-2.5">Prestations</h3>
                <ul className="list-disc list-inside text-sm md:text-base leading-relaxed opacity-90 mb-6 space-y-1.5">
                  {activeProject.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>

                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest opacity-40 mb-2.5">Le Projet</h3>
                <p className="text-sm md:text-base leading-relaxed opacity-90 text-left md:text-justify">
                  {activeProject.description}
                </p>
                
                {activeProject.link && (
                  <div className="mt-4">
                    <button onClick={() => handleLinkClick(activeProject)} className="text-sm border-b border-current pb-0.5 hover:opacity-50 transition-opacity">
                      Voir plus ↗
                    </button>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t border-black/10">
                <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest opacity-40 mb-2.5">Crédits</h3>
                <div className="space-y-1.5">
                  {activeProject.team.main.map((member, index) => {
                    const [role, name] = member.split(' : ');
                    return (
                      <p key={`main-${index}`} className="text-sm leading-relaxed">
                        <span className="font-bold">{role} :</span> <span className="opacity-90">{name}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 : Deux vidéos 9:16 + Logo au centre */}
          {activeProject.videos && (
            <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-12 border-t border-black/10">
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-10">
                
                {/* Vidéo Gauche */}
                <div className="w-[82%] max-w-[300px] md:max-w-[330px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black/10">
                  <video 
                    controls 
                    playsInline 
                    preload="metadata" 
                    className="w-full h-full object-cover"
                  >
                    <source src={`${activeProject.videos.left}#t=0.001`} type="video/mp4" />
                    Votre navigateur ne gère pas la balise vidéo.
                  </video>
                </div>

                {/* Séparateur : Logo Miam-Logo.png */}
                <div className="w-28 sm:w-32 md:w-44 flex-shrink-0 flex items-center justify-center py-2 md:py-0">
                  <img 
                    src={activeProject.videos.logo} 
                    alt={`Logo ${activeProject.title}`} 
                    className="w-full h-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Vidéo Droite */}
                <div className="w-[82%] max-w-[300px] md:max-w-[330px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black/10">
                  <video 
                    controls 
                    playsInline 
                    preload="metadata" 
                    className="w-full h-full object-cover"
                  >
                    <source src={`${activeProject.videos.right}#t=0.001`} type="video/mp4" />
                    Votre navigateur ne gère pas la balise vidéo.
                  </video>
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {isLightboxOpen && allImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white p-4 z-50">✕</button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentImageIndex} src={allImages[currentImageIndex]}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1} onDragEnd={handleDragEnd}
                className="max-w-[95%] max-h-[90vh] object-contain cursor-grab active:cursor-grabbing shadow-2xl"
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); prevImage();}}>❮</button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-6 hidden md:block" onClick={(e) => {e.stopPropagation(); nextImage();}}>❯</button>
            </div>
            <div className="absolute bottom-6 text-white/40 text-sm tracking-widest pointer-events-none">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Commercial;
