"use client";

import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Character } from './Character';
import * as THREE from 'three';



function SceneController() {
  const { camera } = useThree();
  const characterRef = useRef<THREE.Group>(null);
  const pointer = new THREE.Vector2();
  
  // Parallax effect using mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (characterRef.current) {
      // Smoothly interpolate character rotation based on mouse (parallax)
      characterRef.current.rotation.y = THREE.MathUtils.lerp(
        characterRef.current.rotation.y,
        (pointer.x * Math.PI) / 8, 
        0.05
      );
      characterRef.current.rotation.x = THREE.MathUtils.lerp(
        characterRef.current.rotation.x,
        (-pointer.y * Math.PI) / 16, 
        0.05
      );
    }
  });

  return (
    <group ref={characterRef} position={[2, -1, 0]}>
      <Character />
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024} 
      />
      <Environment preset="city" />
      
      <Suspense fallback={null}>
        <SceneController />
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      </Suspense>
    </Canvas>
  );
}
