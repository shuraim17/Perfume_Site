import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TheEssence() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
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
      style={{ backgroundColor: '#1d1d1d', padding: '160px 48px' }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: '600px', textAlign: 'center' }}
      >
        <p
          ref={textRef}
          className="text-subheading"
          style={{ color: '#ffffff', opacity: 0 }}
        >
          True luxury is an invisible signature. AURA bridges the ancient
          alchemy of scent with the boundless possibilities of tomorrow.
        </p>
      </div>
    </section>
  );
}
