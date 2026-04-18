import { useEffect } from 'react';
import Navigation from './sections/Navigation';
import GlobalHero from './sections/GlobalHero';
import TheEssence from './sections/TheEssence';
import VirtualAtelier from './sections/VirtualAtelier';
import SeasonalSelections from './sections/SeasonalSelections';
import FeaturedCollection from './sections/FeaturedCollection';
import Footer from './sections/Footer';

export default function App() {
  useEffect(() => {
    // Smooth scroll polyfill for browsers that need it
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative">
      <Navigation />
      <GlobalHero />
      <TheEssence />
      <VirtualAtelier />
      <SeasonalSelections />
      <FeaturedCollection />
      <Footer />
    </div>
  );
}
