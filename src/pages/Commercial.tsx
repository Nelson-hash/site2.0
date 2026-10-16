import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import HomeLink from '../components/HomeLink';

// --- INTERFACES ---
interface CommercialProject {
  title: string;
  client: string;
  year: string;
  reelUrl?: string;
  heroImages: string[];      // 2 photos 16:9
  verticalImages: string[];  // 3 photos 9:16
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
    client: "Food Truck", 
    year: "2026", 
    heroImages: [
      "images/pub/4.jpg", // Photo 16:9 gauche
      "images/pub/5.jpg"  // Photo 16:9 droite
    ],
    verticalImages: [
      "images/pub/7.jpg", // Photo 9:16 n°1
      "images/pub/8.jpg", // Photo 9:16 n°2
      "images/pub/9.jpg"  // Photo 9:16 n°3 (ajoutez-en une 3ème)
    ],
    description: "Campagne de communication digitale pour mettre en avant le savoir-faire et les produits du Food Truck. Un format dynamique pensé spécifiquement pour les réseaux sociaux.",
    services: [
      "Réalisation de Reel Instagram (Format 9:16)",
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

// --- MAIN COMPONENT ---
const Commercial: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useCursor();
  const navigableProjects = useMemo(() => commercialProjects, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState(false);

  const activeProject = navigableProjects[currentIndex];

  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    window.scrollTo(0, 0);
  }, [activeProject]);

  const goToProject = useCallback((index: number) => {
    if (index === currentIndex) return;
    if (index >= 0 && index < navigableProjects.length) {
      setCurrentIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentIndex, navigableProjects.length]);

  const handleBackToHome = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => navigate('/'), 600);
  }, [navigate]);

  const handleLinkClick = (project: CommercialProject) => project.link && window.open(project.link, '_blank');

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
      {/* HEADER */}
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
      
      {/* NAVIGATION LATERALE */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 z-40 pointer-events-auto">
        {navigableProjects.map((project, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div key={project.title} onClick={() => goToProject(idx)} className="flex items-center justify-end gap-3 cursor-pointer group">
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
                className="w-1.5 md:w-2 rounded-full bg-current origin-center group-hover:opacity-80"
                style={{ color: activeProject.theme.text }}
              />
            </div>
          );
        })}
      </div>

      {/* CONTENU PRINCIPAL */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProject.title}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex flex-col pb-20"
        >
          {/* TITRE */}
          <div className="w-full text-center mt-24 mb-12 px-4">
             <h1 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-2 whitespace-pre-line">{activeProject.title}</h1>
             <p className="text-sm md:text-lg opacity-60 tracking-wide">{activeProject.client} — {activeProject.year}</p>
          </div>

          {/* SECTION 1 : Deux grandes photos 16:9 côte à côte */}
          <div className="w-full px-4 md:px-8 mb-24 h-[50vh] md:h-[80vh] flex flex-col md:flex-row gap-4">
            {activeProject.heroImages.slice(0, 2).map((img, idx) => (
              <div key={`hero-${idx}`} className="w-full md:w-1/2 h-full rounded-lg overflow-hidden shadow-lg bg-black/5">
                <img 
                  src={img} 
                  alt={`${activeProject.title} hero ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* SECTION 2 : 3 photos 9:16 au scroll + Description sticky */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* Colonne de gauche : 3 photos 9:16 superposées au scroll */}
            <div className="w-full lg:w-3/5 flex flex-col gap-12 md:gap-24">
              {activeProject.verticalImages.map((img, idx) => (
                <div key={`vert-${idx}`} className="w-full sm:w-[80%] mx-auto aspect-[9/16] rounded-lg overflow-hidden shadow-lg bg-black/5">
                  <img 
                    src={img} 
                    alt={`${activeProject.title} vertical ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Colonne de droite : Textes (Sticky pour rester à l'écran pendant le défilement) */}
            <div className="w-full lg:w-2/5 flex flex-col gap-8 lg:sticky lg:top-32 pb-12">
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
    </motion.div>
  );
};

export default Commercial;
