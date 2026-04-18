import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Float,
  ContactShadows,
  MeshDistortMaterial,
} from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { damp } from 'maath/easing';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────── 3D COMPONENTS ──────────────────────── */

function GlassMatrix({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 12;

  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = ((i % 3) - 1) * 2;
      const y = (Math.floor((i % 9) / 3) - 1) * 2;
      const z = (Math.floor(i / 9) - 0.5) * 2;
      pos.push([x, y, z]);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += delta * 0.1 * (i % 2 === 0 ? 1 : -1);
      child.rotation.y += delta * 0.15 * (i % 3 === 0 ? 1 : -1);
    });
  });

  const matrixOpacity = progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1;

  return (
    <group
      ref={groupRef}
      visible={matrixOpacity > 0.01}
      scale={matrixOpacity}
    >
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <icosahedronGeometry args={[0.5, 1]} />
          <MeshDistortMaterial
            color="#ffffff"
            distort={0.2}
            speed={1}
            roughness={0.05}
            metalness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function GoldenPyramid({ progress }: { progress: number }) {
  const pyramidRef = useRef<THREE.Group>(null);
  const pyramidOpacity =
    progress > 0.2 && progress < 0.8
      ? progress < 0.4
        ? (progress - 0.2) * 5
        : progress > 0.6
          ? (0.8 - progress) * 5
          : 1
      : 0;

  useFrame((_, delta) => {
    if (!pyramidRef.current) return;
    pyramidRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group
      ref={pyramidRef}
      visible={pyramidOpacity > 0.01}
      scale={pyramidOpacity}
    >
      <mesh position={[0, -1, 0]}>
        <coneGeometry args={[3, 5, 4]} />
        <meshPhysicalMaterial
          color="#ffb800"
          metalness={1.0}
          roughness={0.15}
          emissive="#ffb800"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Wireframe overlay */}
      <lineSegments>
        <edgesGeometry args={[new THREE.ConeGeometry(3, 5, 4)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function DivineIdol({ progress }: { progress: number }) {
  const idolRef = useRef<THREE.Group>(null);
  const idolOpacity =
    progress > 0.4 && progress < 0.8
      ? progress < 0.55
        ? (progress - 0.4) * 6.67
        : progress > 0.65
          ? (0.8 - progress) * 6.67
          : 1
      : 0;

  useFrame((_, delta) => {
    if (!idolRef.current) return;
    idolRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group
      ref={idolRef}
      visible={idolOpacity > 0.01}
      scale={idolOpacity}
    >
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh>
          <torusKnotGeometry args={[0.6, 0.12, 128, 16, 3, 4]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.1}
            emissive="#ffb800"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.35, 2]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.1}
            emissive="#ffb800"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particleCount = 20;

  const particles = useMemo(() => {
    const result: {
      pos: [number, number, number];
      color: string;
      speed: number;
      geo: string;
    }[] = [];
    const colors = ['#ffffff', '#ffb800', '#ef1414'];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2;
      result.push({
        pos: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ],
        color: colors[i % colors.length],
        speed: 0.2 + Math.random() * 0.5,
        geo: i % 3 === 0 ? 'sphere' : i % 3 === 1 ? 'box' : 'cone',
      });
    }
    return result;
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child, i) => {
      child.rotation.x += delta * particles[i].speed;
      child.rotation.y += delta * particles[i].speed * 0.7;
      child.position.y += Math.sin(Date.now() * 0.001 + i) * 0.001;
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          {p.geo === 'sphere' ? (
            <sphereGeometry args={[0.04, 8, 8]} />
          ) : p.geo === 'box' ? (
            <boxGeometry args={[0.06, 0.06, 0.06]} />
          ) : (
            <coneGeometry args={[0.04, 0.1, 6]} />
          )}
          <meshPhysicalMaterial
            color={p.color}
            metalness={0.5}
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    targetRot.current.x = mouseRef.current.y * 0.05;
    targetRot.current.y = mouseRef.current.x * 0.05;
    damp(camera.rotation, 'x', targetRot.current.x, 0.1, delta);
    damp(camera.rotation, 'y', targetRot.current.y, 0.1, delta);

    // Camera movement based on scroll
    const p = scrollProgress;
    const z = p < 0.4 ? 8 : p < 0.6 ? 7 : p < 0.8 ? 5 : 6;
    const y = p < 0.4 ? 0 : p < 0.6 ? -1 : p < 0.8 ? 0.5 : 0;
    damp(camera.position, 'z', z, 0.1, delta);
    damp(camera.position, 'y', y, 0.1, delta);
  });

  const lightColor =
    scrollProgress > 0.3 && scrollProgress < 0.7 ? '#ffb800' : '#ffffff';

  return (
    <>
      <ambientLight intensity={0.3} color="#ffffff" />
      <pointLight position={[5, 5, 5]} intensity={2.0} color={lightColor} />
      <pointLight position={[-3, -2, 4]} intensity={0.8} color="#e2e2e2" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
      />

      <GlassMatrix progress={scrollProgress} />
      <GoldenPyramid progress={scrollProgress} />
      <DivineIdol progress={scrollProgress} />
      <FloatingParticles />

      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      <Environment preset="city" resolution={256} />
    </>
  );
}

/* ──────────────────────── MAIN HERO COMPONENT ──────────────────────── */

export default function GlobalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      },
    });

    // Phase 1: Matrix Entrance
    tl.to(
      '.parallax-bg',
      {
        y: '125vh',
        scale: 1.1,
        filter: 'brightness(0.8)',
        ease: 'power2.inOut',
        duration: 1,
      },
      0,
    );

    // Phase 2: Pyramid appears
    tl.to(
      '.pyramid-overlay',
      { opacity: 1, scale: 1, ease: 'power2.inOut', duration: 1 },
      0.2,
    );

    // Phase 3: Bloom and glow increase
    tl.to('.bloom-overlay', { opacity: 0.7, ease: 'power2.inOut', duration: 1 }, 0.4);

    // Phase 4: Camera zoom / final reveal
    tl.to('.parallax-bg', { scale: 1.5, ease: 'power2.inOut', duration: 1 }, 0.6);

    // Phase 5: Fade out
    tl.to('.hero-webgl', { opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0.85);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-sequence-container relative"
      style={{ height: '300vh' }}
    >
      {/* Fixed WebGL Canvas */}
      <div
        className="hero-webgl fixed inset-0 z-[2] pointer-events-none"
        style={{ opacity: 1 }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Parallax Video Background */}
      <div
        className="parallax-bg fixed inset-0 z-[1]"
        style={{ willChange: 'transform, filter' }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/bg-atmosphere.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ filter: 'brightness(0.6)' }}
        />
      </div>

      {/* Bloom Overlay */}
      <div
        className="bloom-overlay fixed inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,184,0,0.15) 0%, transparent 70%)',
          opacity: 0,
          mixBlendMode: 'screen',
        }}
      />

      {/* Pyramid Video Overlay */}
      <div
        className="pyramid-overlay fixed inset-0 z-[2] pointer-events-none"
        style={{ opacity: 0, transform: 'scale(0.8)' }}
      >
        <video
          className="w-full h-full object-cover"
          src="/videos/bg-atmosphere.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ filter: 'brightness(0.3) sepia(1) hue-rotate(-30deg)' }}
        />
      </div>

      {/* Hero Title Overlay */}
      <div className="fixed inset-0 z-[4] pointer-events-none flex flex-col items-center justify-center">
        <h1
          className="text-display-xl text-white text-center"
          style={{
            textShadow: '0 1px 20px rgba(0, 0, 0, 0.35)',
            opacity: Math.max(0, 1 - scrollProgress * 2),
            transform: `translateY(${scrollProgress * -50}px)`,
          }}
        >
          AURA
        </h1>
        <p
          className="text-body-lg text-white/80 mt-4 text-center"
          style={{
            textShadow: '0 1px 20px rgba(0, 0, 0, 0.35)',
            opacity: Math.max(0, 1 - scrollProgress * 3),
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}
        >
          The Art of Scent
        </p>
      </div>
    </div>
  );
}
