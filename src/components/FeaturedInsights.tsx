'use client';

import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Insight {
  id: number;
  title: string;
  description: string;
  color: string;
}

function InsightCard({ 
  insight,
  index, 
  isTop,
  isSecond,
  onDrag
}: any) {
  const groupRef = useRef<THREE.Group>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
  });
  
  // Smooth interpolation targets
  const targetX = useRef(0);
  const targetY = useRef(0);
  const targetZ = useRef(0);
  const targetRotZ = useRef(0);
  const targetScale = useRef(1);
  
  // Map insight IDs to certificate images
  const imageMap: { [key: number]: string } = {
    1: '/certificates/npetl.png',
    2: '/certificates/cousera1.png',
    3: '/certificates/coursera2.png',
  };
  
  const texture = useTexture(imageMap[insight.id]) as THREE.Texture;
  
  // Stack layout - consistent offsets
  const baseZ = -index * 0.15;
  const baseY = -index * 0.08;
  const baseRotZ = index * 0.02 * (index % 2 === 0 ? 1 : -1);
  const baseScale = 1 - (index * 0.03);
  
  // Initialize targets
  targetY.current = baseY;
  targetZ.current = baseZ;
  targetRotZ.current = baseRotZ;
  targetScale.current = baseScale;

  // Smooth interpolation in animation loop
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Lerp for smooth movement
    const lerpFactor = 0.15;
    
    groupRef.current.position.x += (targetX.current - groupRef.current.position.x) * lerpFactor;
    groupRef.current.position.y += (targetY.current - groupRef.current.position.y) * lerpFactor;
    groupRef.current.position.z += (targetZ.current - groupRef.current.position.z) * lerpFactor;
    groupRef.current.rotation.z += (targetRotZ.current - groupRef.current.rotation.z) * lerpFactor;
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale.current - groupRef.current.scale.x) * lerpFactor
    );
    
    // Show next card effect when top card is being dragged
    if (isSecond && dragStateRef.current.isDragging) {
      targetY.current = 0;
      targetScale.current = 1;
    } else if (isSecond) {
      targetY.current = baseY;
      targetScale.current = baseScale;
    }
  });

  const handlePointerDown = (e: any) => {
    if (!isTop) return;
    e.stopPropagation();
    dragStateRef.current.isDragging = true;
    dragStateRef.current.startX = e.point.x;
  };

  const handlePointerMove = (e: any) => {
    if (!dragStateRef.current.isDragging || !isTop) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragStateRef.current.startX;
    
    // Update targets for smooth interpolation
    targetX.current = deltaX;
    targetZ.current = Math.abs(deltaX) * 0.5;
    targetRotZ.current = deltaX * 0.15;
  };

  const handlePointerUp = (e: any) => {
    if (!dragStateRef.current.isDragging) return;
    e.stopPropagation();
    
    const deltaX = e.point.x - dragStateRef.current.startX;
    dragStateRef.current.isDragging = false;
    
    onDrag?.(deltaX, groupRef.current);
  };

  // Certificate and border dimensions
  const certWidth = 16;
  const certHeight = 11;
  const borderPadding = 0.25;
  const borderWidth = certWidth + (borderPadding * 2);
  const borderHeight = certHeight + (borderPadding * 2);

  return (
    <group 
      ref={groupRef}
      position={[0, baseY, baseZ]} 
      rotation={[0, 0, baseRotZ]}
      scale={baseScale}
    >
      {/* Paper thickness/depth - back layer */}
      <mesh position={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[borderWidth + 0.05, borderHeight + 0.05, 0.08]} />
        <meshStandardMaterial
          color="#e8e8e8"
          roughness={0.9}
        />
      </mesh>
      
      {/* White rounded border using RoundedBox */}
      <RoundedBox
        args={[borderWidth, borderHeight, 0.02]}
        radius={0.35}
        smoothness={8}
        position={[0, 0, -0.02]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.9}
        />
      </RoundedBox>
      
      {/* Main certificate image - on top */}
      <mesh
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <planeGeometry args={[certWidth, certHeight]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.FrontSide}
          roughness={0.7}
          transparent={false}
          depthWrite={true}
          depthTest={true}
        />
      </mesh>
      
      {/* Folded corner effect - top right */}
      <mesh position={[certWidth/2 - 0.3, certHeight/2 - 0.3, 0.01]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          color="#d0d0d0"
          side={THREE.DoubleSide}
          roughness={0.8}
        />
      </mesh>
      
      {/* Crumpled edge effect - bottom left corner */}
      <mesh position={[-certWidth/2 + 0.3, -certHeight/2 + 0.3, 0.01]} rotation={[0, 0, -Math.PI / 6]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial
          color="#c8c8c8"
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>
      
      {/* Corner accent - top left */}
      <mesh position={[-certWidth/2 + 0.3, certHeight/2 - 0.3, 0.01]} rotation={[0, 0, Math.PI / 8]}>
        <planeGeometry args={[0.35, 0.35]} />
        <meshStandardMaterial
          color="#d5d5d5"
          side={THREE.DoubleSide}
          roughness={0.85}
        />
      </mesh>
      
      {/* Corner accent - bottom right */}
      <mesh position={[certWidth/2 - 0.35, -certHeight/2 + 0.35, 0.01]} rotation={[0, 0, -Math.PI / 5]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial
          color="#cdcdcd"
          side={THREE.DoubleSide}
          roughness={0.88}
        />
      </mesh>
    </group>
  );
}

export default function FeaturedInsights() {
  const insights: Insight[] = [
    { 
      id: 1, 
      title: 'Cloud Computing Certification', 
      description: 'Advanced cloud architecture and distributed systems.',
      color: '#8bb8e8'
    },
    { 
      id: 2, 
      title: 'Advanced Networking Certification', 
      description: 'Professional networking protocols and infrastructure.',
      color: '#c5e063'
    },
    { 
      id: 3, 
      title: 'TCP/IP Certification', 
      description: 'Network protocols and internet communication standards.',
      color: '#eede84'
    },
  ];

  const [stack, setStack] = useState(insights);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDrag = (deltaX: number, mesh: any) => {
    if (isAnimating || !mesh) return;

    const threshold = 1.5;

    if (Math.abs(deltaX) > threshold) {
      setIsAnimating(true);
      const direction = deltaX > 0 ? 12 : -12;
      
      // Animate exit with pure interpolation
      const startX = mesh.position.x;
      const startZ = mesh.position.z;
      const startRotZ = mesh.rotation.z;
      const startTime = Date.now();
      const duration = 600; // ms
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (power2.out)
        const eased = 1 - Math.pow(1 - progress, 2);
        
        mesh.position.x = startX + (direction - startX) * eased;
        mesh.position.z = startZ + (1.5 - startZ) * eased;
        mesh.rotation.z = startRotZ + ((direction > 0 ? 0.6 : -0.6) - startRotZ) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Complete - reorder stack
          setStack(prev => {
            const newStack = [...prev];
            const removed = newStack.shift()!;
            newStack.push(removed);
            return newStack;
          });
          
          // Reset position
          mesh.position.x = 0;
          mesh.position.z = 0;
          mesh.rotation.z = 0;
          mesh.scale.set(1, 1, 1);
          setIsAnimating(false);
        }
      };
      
      animate();
    } else {
      // Return to center with spring effect
      const startX = mesh.position.x;
      const startZ = mesh.position.z;
      const startRotZ = mesh.rotation.z;
      const startTime = Date.now();
      const duration = 500; // ms
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Back.out easing
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const eased = 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
        
        mesh.position.x = startX + (0 - startX) * eased;
        mesh.position.z = startZ + (0 - startZ) * eased;
        mesh.rotation.z = startRotZ + (0 - startRotZ) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  };

  return (
    <div className="featured-insights-3d">
      <h2 className="insights-3d-title">Certifications</h2>
      <p className="insights-3d-subtitle">Drag left or right to explore</p>
      
      <div className="insights-canvas-wrapper">
        <Suspense fallback={
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            Loading certificates...
          </div>
        }>
          <Canvas
            frameloop="always"
            shadows
            camera={{ position: [0, 0, 14], fov: 50 }}
            className="cursor-grab active:cursor-grabbing"
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false
            }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
          >
          <color attach="background" args={['#151515']} />
          
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight
            position={[-3, 5, 3]}
            intensity={0.8}
          />
          <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffffff" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.5}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          <Suspense fallback={null}>
            <group>
              {stack.map((insight, index) => (
                <InsightCard
                  key={`${insight.id}-${index}`}
                  insight={insight}
                  index={index}
                  isTop={index === 0 && !isAnimating}
                  isSecond={index === 1}
                  onDrag={handleDrag}
                />
              ))}
            </group>
          </Suspense>
        </Canvas>
        </Suspense>
      </div>

      <div className="insights-info">
        <h3>{stack[0].title}</h3>
        <p>{stack[0].description}</p>
      </div>

      <div className="insights-indicators">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`insight-dot ${stack[0].id === insight.id ? 'active' : ''}`}
            style={{ backgroundColor: insight.color }}
          />
        ))}
      </div>
    </div>
  );
}
