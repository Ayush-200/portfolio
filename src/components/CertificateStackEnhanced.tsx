'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Certificate {
  id: number;
  imagePath: string;
  title: string;
}

const DRAG_THRESHOLD = 0.8;
const STACK_OFFSET = 0.15;

function CertificateCard({
  imagePath,
  position,
  rotation,
  scale,
  isActive,
  cardRef,
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, imagePath) as THREE.Texture;
  const hoverRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (cardRef) {
      cardRef.current = meshRef.current;
    }
  }, [cardRef]);

  useFrame((state) => {
    if (!meshRef.current || !isActive) return;

    const mouseX = state.mouse.x * 0.08;
    const mouseY = state.mouse.y * 0.08;

    hoverRef.current.x = THREE.MathUtils.lerp(hoverRef.current.x, mouseX, 0.1);
    hoverRef.current.y = THREE.MathUtils.lerp(hoverRef.current.y, mouseY, 0.1);

    meshRef.current.rotation.y = rotation[1] + hoverRef.current.x;
    meshRef.current.rotation.x = rotation[0] - hoverRef.current.y;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[4, 2.8]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.05}
      />
    </mesh>
  );
}

export default function CertificateStackEnhanced() {
  const certificates: Certificate[] = [
    { id: 1, imagePath: '/certificates/cert1.jpg', title: 'Certificate 1' },
    { id: 2, imagePath: '/certificates/cert2.jpg', title: 'Certificate 2' },
    { id: 3, imagePath: '/certificates/cert3.jpg', title: 'Certificate 3' },
    { id: 4, imagePath: '/certificates/cert4.jpg', title: 'Certificate 4' },
    { id: 5, imagePath: '/certificates/cert5.jpg', title: 'Certificate 5' },
  ];

  const [stack, setStack] = useState(certificates);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: number]: any }>({});
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });

  useEffect(() => {
    certificates.forEach((cert) => {
      cardRefs.current[cert.id] = { current: null };
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    dragState.current.isDragging = true;
    dragState.current.startX = e.clientX;
    dragState.current.currentX = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging || isAnimating) return;

    const deltaX = (e.clientX - dragState.current.startX) / 100;
    dragState.current.currentX = deltaX;

    const topCard = cardRefs.current[stack[0].id]?.current;
    if (topCard) {
      const liftY = Math.min(Math.abs(deltaX) * 0.2, 0.4);
      const tiltZ = deltaX * 0.15;

      topCard.position.x = deltaX * 0.3;
      topCard.position.y = liftY;
      topCard.rotation.z = tiltZ;
    }
  };

  const handlePointerUp = () => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;

    const deltaX = dragState.current.currentX;
    const topCard = cardRefs.current[stack[0].id]?.current;

    if (Math.abs(deltaX) > DRAG_THRESHOLD && topCard) {
      slideCardAway(deltaX > 0 ? 1 : -1);
    } else if (topCard) {
      gsap.to(topCard.position, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.6)',
      });
      gsap.to(topCard.rotation, {
        z: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.6)',
      });
    }
  };

  const slideCardAway = (direction: number) => {
    setIsAnimating(true);
    const topCard = cardRefs.current[stack[0].id]?.current;

    if (!topCard) return;

    gsap.to(topCard.position, {
      x: direction * 10,
      y: 0.5,
      duration: 0.7,
      ease: 'power3.out',
    });

    gsap.to(topCard.rotation, {
      z: direction * 0.6,
      duration: 0.7,
      ease: 'power3.out',
      onComplete: () => {
        setStack((prev) => {
          const newStack = [...prev];
          const removed = newStack.shift()!;
          newStack.push(removed);
          return newStack;
        });

        setCurrentIndex((prev) => (prev + 1) % certificates.length);

        gsap.set(topCard.position, { x: 0, y: 0, z: -1 });
        gsap.set(topCard.rotation, { z: 0 });

        setIsAnimating(false);
      },
    });
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 7], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-5, 3, 5]} intensity={0.4} color="#a78bfa" />
          <spotLight
            position={[0, 5, 0]}
            intensity={0.3}
            angle={0.6}
            penumbra={1}
            castShadow
          />

          <group>
            {stack.map((cert, index) => {
              const zPos = -index * STACK_OFFSET;
              const scale = 1 - index * 0.03;
              const rotationOffset = (index * 0.015) * (index % 2 === 0 ? 1 : -1);

              return (
                <CertificateCard
                  key={cert.id}
                  imagePath={cert.imagePath}
                  position={[0, 0, zPos]}
                  rotation={[0, rotationOffset, 0]}
                  scale={scale}
                  isActive={index === 0 && !isAnimating}
                  cardRef={cardRefs.current[cert.id]}
                />
              );
            })}
          </group>
        </Canvas>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white text-lg font-medium mb-2">
          {stack[0].title}
        </p>
        <div className="flex gap-2 justify-center">
          {certificates.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-white w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
