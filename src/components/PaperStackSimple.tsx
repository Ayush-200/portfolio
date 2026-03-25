'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface Paper {
  id: number;
  imagePath: string;
}

function Loader() {
  return (
    <Html center>
      <div className="text-white text-xl">Loading papers...</div>
    </Html>
  );
}

function PaperCard({ 
  imagePath, 
  index, 
  isTop,
  onDrag
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imagePath) as THREE.Texture;
  
  const zPosition = -index * 0.05;
  const yPosition = -index * 0.03;
  const scale = 1 - (index * 0.02);
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
  });

  const handlePointerDown = (e: any) => {
    if (!isTop) return;
    e.stopPropagation();
    dragState.current.isDragging = true;
    dragState.current.startX = e.point.x;
  };

  const handlePointerMove = (e: any) => {
    if (!dragState.current.isDragging || !isTop || !meshRef.current) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragState.current.startX;
    meshRef.current.position.x = deltaX;
    meshRef.current.position.z = Math.abs(deltaX) * 0.5;
    meshRef.current.rotation.z = deltaX * 0.15;
  };

  const handlePointerUp = (e: any) => {
    if (!dragState.current.isDragging || !meshRef.current) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragState.current.startX;
    dragState.current.isDragging = false;
    
    onDrag?.(deltaX, meshRef.current);
  };

  return (
    <mesh
      ref={meshRef}
      position={[0, yPosition, zPosition]}
      scale={scale}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <planeGeometry args={[4, 5]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.7}
      />
    </mesh>
  );
}

export default function PaperStackSimple() {
  const papers: Paper[] = [
    { id: 1, imagePath: '/certificates/cert1.jpg' },
    { id: 2, imagePath: '/certificates/cert2.jpg' },
    { id: 3, imagePath: '/certificates/cert3.jpg' },
    { id: 4, imagePath: '/certificates/cert4.jpg' },
    { id: 5, imagePath: '/certificates/cert5.jpg' },
  ];

  const [stack, setStack] = useState(papers);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDrag = (deltaX: number, mesh: any) => {
    if (isAnimating || !mesh) return;

    if (Math.abs(deltaX) > 1) {
      setIsAnimating(true);
      const direction = deltaX > 0 ? 10 : -10;
      
      gsap.to(mesh.position, {
        x: direction,
        z: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
      
      gsap.to(mesh.rotation, {
        z: direction > 0 ? 0.5 : -0.5,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setStack(prev => {
            const newStack = [...prev];
            const removed = newStack.shift()!;
            newStack.push(removed);
            return newStack;
          });
          
          gsap.set(mesh.position, { x: 0, z: 0 });
          gsap.set(mesh.rotation, { z: 0 });
          setIsAnimating(false);
        },
      });
    } else {
      gsap.to(mesh.position, {
        x: 0,
        z: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
      gsap.to(mesh.rotation, {
        z: 0,
        duration: 0.4,
        ease: 'back.out(1.7)',
      });
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-4xl font-bold text-white mb-2">My Certificates</h2>
        <p className="text-gray-300">Drag left or right to view next paper</p>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#0f172a']} />
        
        <ambientLight intensity={1} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
        />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />

        <Suspense fallback={<Loader />}>
          <group>
            {stack.map((paper, index) => (
              <PaperCard
                key={`${paper.id}-${index}`}
                imagePath={paper.imagePath}
                index={index}
                isTop={index === 0 && !isAnimating}
                onDrag={handleDrag}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {papers.map((paper, idx) => (
          <div
            key={paper.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              stack[0].id === paper.id 
                ? 'bg-blue-500 w-8' 
                : 'bg-gray-500 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
