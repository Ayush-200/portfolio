'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface Paper {
  id: number;
  imagePath: string;
}

function PaperCard({ 
  imagePath, 
  index, 
  totalCards,
  isTop,
  paperRef,
  onDragStart,
  onDragMove, 
  onDragEnd 
}: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imagePath) as THREE.Texture;
  
  // Stack positioning - papers slightly offset
  const zPosition = -index * 0.01;
  const yPosition = index * 0.02;
  const scale = 1 - (index * 0.01);
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
  });

  // Expose mesh ref to parent
  if (paperRef && meshRef.current) {
    paperRef.current = meshRef.current;
  }

  const handlePointerDown = (e: any) => {
    if (!isTop) return;
    e.stopPropagation();
    dragState.current.isDragging = true;
    dragState.current.startX = e.point.x;
    dragState.current.startY = e.point.y;
    onDragStart?.();
  };

  const handlePointerMove = (e: any) => {
    if (!dragState.current.isDragging || !isTop) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragState.current.startX;
    const deltaY = e.point.y - dragState.current.startY;
    
    onDragMove?.(deltaX, deltaY, meshRef.current);
  };

  const handlePointerUp = (e: any) => {
    if (!dragState.current.isDragging) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragState.current.startX;
    dragState.current.isDragging = false;
    
    onDragEnd?.(deltaX, meshRef.current);
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
      <planeGeometry args={[3.5, 4.5]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.0}
      />
    </mesh>
  );
}

export default function PaperStack() {
  const papers: Paper[] = [
    { id: 1, imagePath: '/certificates/cert1.jpg' },
    { id: 2, imagePath: '/certificates/cert2.jpg' },
    { id: 3, imagePath: '/certificates/cert3.jpg' },
    { id: 4, imagePath: '/certificates/cert4.jpg' },
    { id: 5, imagePath: '/certificates/cert5.jpg' },
  ];

  const [stack, setStack] = useState(papers);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const topPaperRef = useRef<any>(null);
  const dragThreshold = 1.2;

  const handleDragStart = () => {
    if (isAnimating) return;
  };

  const handleDragMove = (deltaX: number, deltaY: number, mesh: any) => {
    if (isAnimating || !mesh) return;
    
    // Move paper with drag
    mesh.position.x = deltaX;
    
    // Slight lift and rotation for realism
    const lift = Math.min(Math.abs(deltaX) * 0.3, 0.5);
    mesh.position.z = lift;
    
    // Rotate based on drag direction
    const rotation = deltaX * 0.1;
    mesh.rotation.z = rotation;
  };

  const handleDragEnd = (deltaX: number, mesh: any) => {
    if (isAnimating || !mesh) return;

    // Check if dragged far enough
    if (Math.abs(deltaX) > dragThreshold) {
      // Slide paper away
      slidePaperAway(deltaX > 0 ? 'right' : 'left', mesh);
    } else {
      // Return to position
      returnPaper(mesh);
    }
  };

  const slidePaperAway = (direction: 'left' | 'right', mesh: any) => {
    setIsAnimating(true);
    const targetX = direction === 'right' ? 8 : -8;
    
    gsap.to(mesh.position, {
      x: targetX,
      z: 0.3,
      duration: 0.5,
      ease: 'power2.out',
    });
    
    gsap.to(mesh.rotation, {
      z: direction === 'right' ? 0.3 : -0.3,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Move top paper to bottom of stack
        setStack(prev => {
          const newStack = [...prev];
          const topPaper = newStack.shift()!;
          newStack.push(topPaper);
          return newStack;
        });
        
        // Reset position for when it comes back
        gsap.set(mesh.position, { x: 0, z: 0 });
        gsap.set(mesh.rotation, { z: 0 });
        
        setIsAnimating(false);
      },
    });
  };

  const returnPaper = (mesh: any) => {
    gsap.to(mesh.position, {
      x: 0,
      z: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
    
    gsap.to(mesh.rotation, {
      z: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Certificates</h2>
        <p className="text-gray-600">Drag left or right to view next paper</p>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 3, 3]} intensity={0.3} />

        <Suspense fallback={null}>
          <group>
            {stack.map((paper, index) => (
              <PaperCard
                key={paper.id}
                imagePath={paper.imagePath}
                index={index}
                totalCards={stack.length}
                isTop={index === 0 && !isAnimating}
                paperRef={index === 0 ? topPaperRef : null}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {papers.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === 0 ? 'bg-orange-600 w-6' : 'bg-orange-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
