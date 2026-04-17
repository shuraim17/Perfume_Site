import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Season {
  id: string;
  name: string;
  description: string;
  video: string;
}

const seasons: Season[] = [
  {
    id: 'spring',
    name: 'Spring',
    description: 'Delicate florals awakening from winter\'s sleep',
    video: '/videos/bg-spring.mp4',
  },
  {
    id: 'summer',
    name: 'Summer',
    description: 'Warm amber rays meet salt-kissed skin',
    video: '/videos/bg-summer.mp4',
  },
  {
    id: 'winter',
    name: 'Winter',
    description: 'Smoky oud and velvet vanilla depths',
    video: '/videos/bg-winter.mp4',
  },
];

function SeasonCard({
  season,
  index,
}: {
  season: Season;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
          },
        },
      );
    });

    return () => ctx.revert();
  }, [index]);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer"
      style={{
        width: '360px',
        height: '480px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${isHovered ? '#ef1414' : '#e2e2e2'}`,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0, 0, 0, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video area */}
      <div
        className="relative overflow-hidden"
        style={{ height: '60%', borderRadius: '12px 12px 0 0' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={season.video}
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 50%, rgba(250, 250, 250, 1) 100%)',
          }}
        />
      </div>

      {/* Text area */}
      <div
        className="flex flex-col justify-between"
        style={{
          height: '40%',
          padding: '24px',
          background: '#fafafa',
        }}
      >
        <div>
          <h3
            className="text-heading"
            style={{ color: '#1d1d1d', marginBottom: '8px' }}
          >
            {season.name}
          </h3>
          <p className="text-body" style={{ color: '#999999' }}>
            {season.description}
          </p>
        </div>

        <div className="flex items-center gap-2" style={{ marginTop: '16px' }}>
          <span
            className="text-caption relative"
            style={{ color: '#ef1414' }}
          >
            Explore
            <span
              className="absolute bottom-0 left-0 h-px"
              style={{
                width: isHovered ? '100%' : '0%',
                backgroundColor: '#ef1414',
                transition: 'width 0.4s ease',
              }}
            />
          </span>
          <ArrowRight
            size={14}
            color="#ef1414"
            style={{
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              transition: 'transform 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function SeasonalSelections() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#fafafa', padding: '120px 48px' }}
    >
      <div className="section-container">
        {/* Section Header */}
        <div ref={headerRef} className="text-center" style={{ marginBottom: '64px', opacity: 0 }}>
          <h2
            className="text-display-lg"
            style={{ color: '#1d1d1d' }}
          >
            Seasonal Harmonies
          </h2>
          <p
            className="text-body-lg"
            style={{ color: '#999999', marginTop: '16px' }}
          >
            Discover the scent of each season
          </p>
        </div>

        {/* Season Cards */}
        <div
          className="flex flex-wrap justify-center gap-6"
          style={{ gap: '24px' }}
        >
          {seasons.map((season, i) => (
            <SeasonCard key={season.id} season={season} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
