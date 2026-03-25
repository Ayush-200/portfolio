# 3D Certificate Stack - Implementation Guide

## Overview
Interactive 3D certificate stack built with React Three Fiber, GSAP, and Next.js. Features drag-to-dismiss interaction, smooth animations, and parallax effects.

## Components Created

### 1. `CertificateCard.tsx`
Basic certificate card component with:
- Texture-mapped plane geometry
- Pointer-based drag interaction
- Hover parallax effect
- Shadow support

### 2. `CertificateStack.tsx`
Main stack manager with:
- Stack state management
- Drag threshold detection
- Card slide-away animation
- Infinite loop logic

### 3. `CertificateStackEnhanced.tsx`
Enhanced version with:
- Better drag physics
- Progress indicators
- Improved lighting setup
- Smoother animations

### 4. `page.tsx` (certificates route)
Demo page at `/certificates`

## Setup Instructions

### 1. Add Certificate Images
Place your certificate images in `public/certificates/`:
```
public/certificates/
  ├── cert1.jpg
  ├── cert2.jpg
  ├── cert3.jpg
  ├── cert4.jpg
  └── cert5.jpg
```

Recommended image specs:
- Resolution: 1024x768 or 2048x1536
- Format: JPG or PNG
- Aspect ratio: 4:3 or similar

### 2. Update Certificate Data
Edit the certificates array in either component:

```typescript
const certificates: Certificate[] = [
  { id: 1, imagePath: '/certificates/cert1.jpg', title: 'AWS Certification' },
  { id: 2, imagePath: '/certificates/cert2.jpg', title: 'React Expert' },
  // Add more...
];
```

### 3. Run the Project
```bash
npm run dev
```

Visit: `http://localhost:3000/certificates`

## Usage

### Basic Version (`CertificateStack`)
```tsx
import CertificateStack from '@/components/CertificateStack';

export default function Page() {
  return <CertificateStack />;
}
```

### Enhanced Version (`CertificateStackEnhanced`)
```tsx
import CertificateStackEnhanced from '@/components/CertificateStackEnhanced';

export default function Page() {
  return <CertificateStackEnhanced />;
}
```

## Interaction Guide

1. **Hover**: Subtle parallax tilt on active card
2. **Drag**: Click and drag horizontally to lift and tilt the top card
3. **Release**: 
   - Small drag → Card returns with elastic bounce
   - Large drag → Card slides off screen, next card comes forward
4. **Loop**: Cards cycle infinitely

## Customization

### Adjust Drag Sensitivity
```typescript
const DRAG_THRESHOLD = 0.8; // Lower = easier to dismiss
```

### Change Stack Spacing
```typescript
const STACK_OFFSET = 0.15; // Distance between cards
```

### Modify Card Size
```typescript
<planeGeometry args={[4, 2.8]} /> // [width, height]
```

### Lighting Adjustments
```typescript
<ambientLight intensity={0.6} />
<directionalLight intensity={1.2} />
```

### Animation Timing
```typescript
gsap.to(topCard.position, {
  duration: 0.7, // Adjust speed
  ease: 'power3.out', // Change easing
});
```

## Performance Tips

1. Use optimized images (WebP format recommended)
2. Limit visible cards to 3-5
3. Enable texture compression
4. Use `dynamic` import with `ssr: false` for Three.js components

## Troubleshooting

### Images not loading
- Check file paths match exactly
- Ensure images are in `public/certificates/`
- Verify image formats are supported

### Drag not working
- Ensure `isActive` prop is true for top card
- Check `isAnimating` state isn't blocking interaction

### Performance issues
- Reduce image resolution
- Lower shadow quality
- Decrease number of cards in stack

## Next Steps

Optional enhancements:
- Add scroll-based animation with GSAP ScrollTrigger
- Implement keyboard navigation
- Add touch swipe support for mobile
- Create card flip animation to show back side
- Add sound effects on card dismiss
