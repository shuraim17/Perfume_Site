import { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  OrbitControls,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────── 3D COMPONENTS ──────────────────────── */

function PerfumeArtifact() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        {/* Main glass body */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.6, 2]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            thickness={2}
            roughness={0}
            ior={1.5}
            dispersion={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Gold ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.08, 16, 100]} />
          <meshPhysicalMaterial
            color="#ffb800"
            metalness={1.0}
            roughness={0.1}
            emissive="#ffb800"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Floating cap */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.3, 32]} />
          <meshPhysicalMaterial
            color="#1d1d1d"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

function FloatingScentParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 6;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particles = useMemo(() => {
    const result: {
      pos: [number, number, number];
      color: string;
      geo: string;
      size: number;
    }[] = [];
    const colors = ['#ffffff', '#ffb800', '#ef1414', '#ffffff', '#ffb800'];
    const geometries = ['sphere', 'box', 'cone', 'sphere', 'box'];
    for (let i = 0; i < 20; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2;
      result.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        color: colors[i % colors.length],
        geo: geometries[i % geometries.length],
        size: 0.03 + Math.random() * 0.04,
      });
    }
    return result;
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child, i) => {
      child.rotation.x += 0.005 * (i % 2 === 0 ? 1 : -1);
      child.rotation.y += 0.008 * (i % 3 === 0 ? 1 : -1);

      // Cursor proximity effect
      const dx = child.position.x - mouseRef.current.x;
      const dy = child.position.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isHovered = dist < 1;
      const targetScale = isHovered ? 1.5 : 1;
      child.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh
          key={i}
          position={p.pos}
        >
          {p.geo === 'sphere' ? (
            <sphereGeometry args={[p.size, 8, 8]} />
          ) : p.geo === 'box' ? (
            <boxGeometry args={[p.size * 1.5, p.size * 1.5, p.size * 1.5]} />
          ) : (
            <coneGeometry args={[p.size, p.size * 2, 6]} />
          )}
          <meshPhysicalMaterial
            color={p.color}
            transmission={0.8}
            roughness={0.1}
            metalness={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function AtelierScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-3, -2, 4]} intensity={0.8} color="#e2e2e2" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
      />

      <PerfumeArtifact />
      <FloatingScentParticles />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={3}
      />

      <Environment preset="studio" resolution={256} />
    </>
  );
}

/* ──────────────────────── MAIN ATELIER COMPONENT ──────────────────────── */

export default function VirtualAtelier() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [xrSupported, setXrSupported] = useState(false);

  useEffect(() => {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      // @ts-ignore
      navigator.xr?.isSessionSupported('immersive-ar').then((supported: boolean) => {
        setXrSupported(supported);
      }).catch(() => setXrSupported(false));
    }

    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
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

  const handleARClick = () => {
    // For non-XR devices, show a modal or message
    if (!xrSupported) {
      alert('AR Experience: On supported devices, this would launch an immersive AR session where you can place and interact with AURA fragrance bottles in your physical space.');
    }
  };

  return (
    <section
      id="atelier"
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: '#000000', minHeight: '100vh' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [4, 2, 8], fov: 35 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <AtelierScene />
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={0.5}
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={15}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div
        ref={contentRef}
        className="relative z-10 pointer-events-none flex flex-col items-center justify-between"
        style={{
          minHeight: '100vh',
          padding: '120px 48px 80px',
          opacity: 0,
        }}
      >
        {/* Top content */}
        <div className="text-center">
          <p className="text-caption" style={{ color: '#999999', marginBottom: '16px' }}>
            EXPERIENCE
          </p>
          <h2
            className="text-display-lg"
            style={{
              color: '#ffffff',
              textShadow: '0 1px 20px rgba(0, 0, 0, 0.35)',
            }}
          >
            Virtual Atelier
          </h2>
          <p
            className="text-body-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '16px',
              maxWidth: '480px',
              textShadow: '0 1px 20px rgba(0, 0, 0, 0.35)',
            }}
          >
            Step inside our digital laboratory. Explore each fragrance as a
            sculptural object — rotate, zoom, and discover the art within.
          </p>
        </div>

        {/* AR Button */}
        <button
          onClick={handleARClick}
          className="pointer-events-auto glass-btn"
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '16px 48px',
            fontSize: '12px',
            letterSpacing: '2px',
          }}
        >
          {xrSupported ? 'ENTER THE ATELIER' : 'VIEW IN AR'}
        </button>
      </div>
    </section>
  );
}
