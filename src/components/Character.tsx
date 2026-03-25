"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

export function Character(props: any) {
  const groupRef = useRef<Group>(null);

  // Fallback animation: gently float the character
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* 3D placeholder meshes removed as requested */}
    </group>
  );
}
