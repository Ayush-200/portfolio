"use client";

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Overlay from '@/components/Overlay';
import '@/styles/home.css';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="main-container">
      <div className="bg-image-container">
        <Image 
          src="/main_character.png" 
          alt="Main Character Background"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="canvas-container">
        <Scene />
      </div>
      <div className="overlay-container">
        <Overlay />
      </div>
    </main>
  );
}
