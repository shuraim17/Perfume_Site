import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  collection: string;
  price: string;
  image: string;
}

const products: Product[] = [
  {
    id: 'aether',
    name: 'Aether',
    collection: 'The Signature Collection',
    price: 'R2,500',
    image: '/images/product-aether.jpg',
  },
  {
    id: 'oud-noir',
    name: 'Oud Noir',
    collection: 'The Oriental Collection',
    price: 'R3,200',
    image: '/images/product-oud-noir.jpg',
  },
  {
    id: 'citrus-absolu',
    name: 'Citrus Absolu',
    collection: 'The Fresh Collection',
    price: 'R1,800',
    image: '/images/product-citrus-absolu.jpg',
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    collection: 'The Floral Collection',
    price: 'R2,800',
    image: '/images/product-velvet-rose.jpg',
  },
];

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = -y * 30; // max ±15 degrees
      const rotateY = x * 30;
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
        transition: 'transform 0.1s ease-out',
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.5s ease-out',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer"
      style={{
        background: '#fafafa',
        borderRadius: '12px',
        overflow: 'hidden',
        opacity: 0,
      }}
    >
      {/* Image area with 3D tilt */}
      <div
        ref={imageContainerRef}
        className="relative overflow-hidden"
        style={{
          aspectRatio: '3/4',
          perspective: '1000px',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{
            ...tiltStyle,
            transformOrigin: 'center center',
          }}
          loading="lazy"
        />
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'rgba(0, 0, 0, 0)',
            transition: 'background 0.3s ease',
            backgroundColor: isHovered
              ? 'rgba(0, 0, 0, 0.1)'
              : 'transparent',
          }}
        >
          <div
            className="flex items-center gap-2"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            <span
              className="text-caption text-white"
              style={{ textShadow: '0 1px 20px rgba(0, 0, 0, 0.5)' }}
            >
              VIEW DETAILS
            </span>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div style={{ padding: '20px 16px' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-body" style={{ color: '#1d1d1d', marginBottom: '4px' }}>
              {product.name}
            </p>
            <p className="text-caption" style={{ color: '#999999' }}>
              {product.collection}
            </p>
          </div>
          <p className="text-body" style={{ color: '#1d1d1d' }}>
            {product.price}
          </p>
        </div>

        {/* Quick add button */}
        <button
          className="flex items-center justify-center mt-4"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1px solid #e2e2e2',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d1d1d';
            e.currentTarget.style.borderColor = '#1d1d1d';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e2e2e2';
          }}
        >
          <Plus size={18} color={isHovered ? '#ffffff' : '#1d1d1d'} />
        </button>
      </div>
    </div>
  );
}

export default function FeaturedCollection() {
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
      id="collection"
      ref={sectionRef}
      style={{ backgroundColor: '#ffffff', padding: '120px 48px' }}
    >
      <div className="section-container">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="text-center"
          style={{ marginBottom: '64px', opacity: 0 }}
        >
          <h2 className="text-display-lg" style={{ color: '#1d1d1d' }}>
            The Collection
          </h2>
          <p
            className="text-body-lg"
            style={{ color: '#999999', marginTop: '16px' }}
          >
            Sculpted for those who command presence
          </p>
        </div>

        {/* Product Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px',
          }}
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
