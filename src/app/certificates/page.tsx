'use client';

import dynamic from 'next/dynamic';

const PaperStack = dynamic(() => import('@/components/PaperStackSimple'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-2xl">Loading 3D Scene...</div>
    </div>
  ),
});

export default function CertificatesPage() {
  return <PaperStack />;
}
