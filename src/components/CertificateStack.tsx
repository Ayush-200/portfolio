'use client';

import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CertificateCard from './CertificateCard';
import gsap from 'gsap';
import * as THREE from 'three';

interface Certificate {
  id: number;
  imagePath: string;
}

const DRAG_THRESHOLD = 0.5;
const STACK_OFFSET = 0.2;

export default function CertificateStack() {
  const certificates: Certificate[] = [
    { id: 1, imagePath: '/certificates/cert1.jpg' },
    { id: 2, imagePath: '/certificates/cert2.jpg' },
    { id: 3, imagePath: '/certificates/cert3.jpg' },
    { id: 4, imagePath: '/certificates/cert4.jpg' },
    { id: 5, imagePath: '/certificates/cert5.jpg' },
  ];

  const [stack, setStack] = useState(certificates);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cardRefs = useRef<{ [key: number]: any }>({});
  const dragData = useRef({ deltaX: 0, liftY: 0, tiltZ: 0 });

  const handleDragStart = () => {
    if (isAnimating) return;
    dragData.current = { deltaX: 0, liftY: 0, tiltZ: 0 };
  };

  const handleDragMove = (deltaX: number) => {
    if (isAnimating) return;
    
    dragData.current.deltaX = deltaX;
    dragData.current.liftY = Math.min(Math.abs(deltaX) * 0.3, 0.5);
    dragData.current.tiltZ = deltaX * 0.2;

    const topCard = cardRefs.current[stack[0].id];
    if (topCard) {
      gsap.to(topCard.position, {
        y: dragData.current.liftY,
        x: deltaX * 0.5,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(topCard.rotation, {
        z: dragData.current.tiltZ,
        duration: 0.1,
        ease: 'power2.out',
      });
    }
  };

  const handleDragEnd = (deltaX: number) => {
    if (isAnimating) return;

    const topCard = cardRefs.current[stack[0].id];
    
    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      // Slide card off screen
      setIsAnimating(true);
      const direction = deltaX > 0 ? 1 : -1;
      
      gsap.to(topCard.position, {
        x: direction * 8,
        y: 0.3,
        duration: 0.6,
        ease: 'power2.out',
      });
      
      gsap.to(topCard.rotation, {
        z: direction * 0.5,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          // Move card to back of stack
          setStack((prev) => {
            const newStack = [...prev];
            const removed = newStack.shift()!;
            newStack.push(removed);
            return newStack;
          });
          
          // Reset card position
          gsap.set(topCard.position, { x: 0, y: 0, z: -1 });
          gsap.set(topCard.rotation, { z: 0 });
          
          setIsAnimating(false);
        },
      });
    } else {
      // Return to original position
      gsap.to(topCard.position, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });
      gsap.to(topCard.rotation, {
        z: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
      });
    }
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />

        <group>
          {stack.map((cert, index) => {
            const zPos = -index * STACK_OFFSET;
            const scale = 1 - index * 0.02;
            const rotationOffset = (index * 0.02) * (index % 2 === 0 ? 1 : -1);
            
            return (
              <CertificateCard
                key={cert.id}
                imagePath={cert.imagePath}
                position={[0, 0, zPos]}
                rotation={[0, rotationOffset, 0]}
                scale={scale}
                isActive={index === 0 && !isAnimating}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              />
            );
          })}
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
