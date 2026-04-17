import { useEffect, useState, useRef } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between px-8 py-4 rounded-full min-w-[600px] max-w-[800px] w-auto transition-all duration-400"
      style={{
        background: scrolled
          ? '#1d1d1d'
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: scrolled ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: scrolled ? 'none' : 'blur(12px)',
        border: scrolled
          ? '1px solid rgba(255, 255, 255, 0.05)'
          : '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-8">
        <button
          onClick={() => scrollToSection('collection')}
          className="text-caption text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-transparent border-none"
        >
          SHOP
        </button>
        <button
          onClick={() => scrollToSection('atelier')}
          className="text-caption text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer bg-transparent border-none"
        >
          EXPERIENCE
        </button>
      </div>

      <div
        className="text-white text-2xl tracking-wide cursor-pointer"
        style={{ fontFamily: "'Newsreader', serif" }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        AURA
      </div>

      <div className="flex items-center gap-8">
        <span
          className="text-caption text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          CART (0)
        </span>
      </div>
    </nav>
  );
}
