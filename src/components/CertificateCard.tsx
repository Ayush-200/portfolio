'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface CertificateCardProps {
  imagePath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isActive: boolean;
  onDragStart?: () => void;
  onDragMove?: (deltaX: number) => void;
  onDragEnd?: (deltaX: number) => void;
}

export default function CertificateCard({
  imagePath,
  position,
  rotation,
  scale,
  isActive,
  onDragStart,
  onDragMove,
  onDragEnd,
}: CertificateCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, imagePath);
  
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
  });

  const handlePointerDown = (e: any) => {
    if (!isActive) return;
    e.stopPropagation();
    dragState.current.isDragging = true;
    dragState.current.startX = e.point.x;
    dragState.current.currentX = 0;
    onDragStart?.();
  };

  const handlePointerMove = (e: any) => {
    if (!dragState.current.isDragging || !isActive) return;
    e.stopPropagation();
    const deltaX = e.point.x - dragState.current.startX;
    dragState.current.currentX = deltaX;
    onDragMove?.(deltaX);
  };

  const handlePointerUp = () => {
    if (!dragState.current.isDragging) return;
    dragState.current.isDragging = false;
    onDragEnd?.(dragState.current.currentX);
  };

  useFrame((state) => {
    if (!meshRef.current || !isActive) return;
    
    // Subtle hover parallax effect
    const mouseX = state.mouse.x * 0.05;
    const mouseY = state.mouse.y * 0.05;
    
    if (!dragState.current.isDragging) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotation[1] + mouseX,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        rotation[0] + mouseY,
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <planeGeometry args={[4, 3]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}
