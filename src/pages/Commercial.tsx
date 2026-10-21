import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  team: { main: string[]; additional?: string[] };
  link?: string;
  theme: { background: string; text: string; accent: string };
}

// --- DATA ---
const commercialProjects: CommercialProject[] = [
  {
    title: "MIAM MIAM MIAM",
    client: "Photos et vidéos pour une marque de restauration",
    year: "2026",
    heroImages: [
      "/images/pub/4.jpg",
      "/images/pub/5.jpg"
    ],
    verticalImages: [
      "/images/pub/7.jpg",
      "/images/pub/8.jpg",
      "/images/pub/9.jpg"
    ],
    videos: {
      left: "/videos/video-gauche.mp4",
      right: "/videos/video-droite.mp4",
      logo: "/images/pub/Miam-Logo.png"
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
    window.scrollTo(0, 0);
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

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);

  const handleBackToHome = useCallback(() => {
    if (isLightboxOpen) {
      closeLightbox();
      return;
    }
    setIsExiting(true);
    setTimeout(() => navigate('/'), 600);
  }, [isLightboxOpen, closeLightbox, navigate]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex(p => (p + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex(p => (p - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBackToHome();
      else if (isLightboxOpen && e.key === 'ArrowRight') nextImage();
      else if (isLightboxOpen && e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackToHome, isLightboxOpen, nextImage, prevImage]);

  const handleLinkClick = (project: CommercialProject) => {
    if (project.link) window.open(project.link, '_blank');
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={handleBackToHome}
            className="pointer-events-auto text-xs md:text-base font-light tracking-widest uppercase hover:opacity-60 transition-opacity bg-white/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none px-3 py-1.5 md:p-0 rounded-full"
            style={{ color: activeProject.theme.text }}
          >
            Retour / Back
          </motion.button>
        </AnimatePresence>
      </div>

      {/* FRISE DE NAVIGATION */}
      <div className="fixed right-2.5 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-40 pointer-events-auto">
        {navigableProjects.map((project, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div key={project.title} onClick={() => goToProject(idx)} className="flex items-center justify-end gap-3 cursor-pointer group">
              <motion.span
                animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1.05 : 1 }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
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

          {/* SECTION 2 : 3 photos 9:16 + Textes */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 lg:gap-16 items-start mb-16 md:mb-24">
            {/* Colonne de gauche : Grille / Carrousel */}
            <div className="w-full lg:w-3/5 flex flex-col">
              <div className="w-full flex sm:grid sm:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-2 sm:pb-0 no-scrollbar">
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
              <span className="sm:hidden text-[10px] uppercase tracking-widest opacity-40 text-center mt-2">
                ← Glisser pour voir les 3 photos →
              </span>
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
                <p className="text-sm md:text-base leading-relaxed opacity-90 text-left md:text-justify mb-6">
                  {activeProject.description}
                </p>

                {activeProject.team.main.length > 0 && (
                  <div>
                    <h3 className="text-[11px] md:text-xs font-bold uppercase tracking-widest opacity-40 mb-2.5">Équipe</h3>
                    <ul className="text-sm md:text-base leading-relaxed opacity-90 space-y-1">
                      {activeProject.team.main.map((member, i) => (
                        <li key={i}>{member}</li>
                      ))}
                      {activeProject.team.additional?.map((member, i) => (
                        <li key={i}>{member}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeProject.link && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleLinkClick(activeProject)}
                      className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
                      style={{ color: activeProject.theme.accent }}
                    >
                      Voir le projet ↗
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3 : Vidéos Reels & Logo */}
          {activeProject.videos && (
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-12 flex flex-col items-center">
              {activeProject.videos.logo && (
                <img
                  src={activeProject.videos.logo}
                  alt="Logo"
                  className="h-14 md:h-16 w-auto object-contain mb-8 opacity-85"
                />
              )}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                <div className="w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black">
                  <video
                    src={activeProject.videos.left}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-black">
                  <video
                    src={activeProject.videos.right}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* LIGHTBOX PLEIN ÉCRAN */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-xs tracking-widest uppercase hover:opacity-70 transition-opacity z-50 p-2"
            >
              Fermer ✕
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 md:left-8 text-white text-3xl hover:opacity-60 transition-opacity z-50 p-3 select-none"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 md:right-8 text-white text-3xl hover:opacity-60 transition-opacity z-50 p-3 select-none"
                >
                  ›
                </button>
              </>
            )}

            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex]}
              alt="Aperçu plein écran"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing select-none"
            />

            <div className="absolute bottom-6 text-white/50 text-xs tracking-widest font-mono">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Commercial;
