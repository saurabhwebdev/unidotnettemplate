import { useState, useEffect } from 'react';

const images = [
  '/auth-bg.jpg',
  '/auth-bg-1.jpg',
  '/auth-bg-2.jpg',
  '/auth-bg-3.jpg',
  '/auth-bg-4.jpg',
];

export function ImageSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="group relative w-full h-full overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((image, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={image}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${image})`,
              opacity: isActive ? 1 : 0,
              transform: `scale(${isActive ? (isHovered ? 1.08 : 1) : 1.15}) ${isHovered ? 'translateY(-2%)' : 'translateY(0)'}`,
              filter: isHovered
                ? 'grayscale(0%) brightness(1.05) contrast(1.05) saturate(1.1)'
                : 'grayscale(100%) brightness(0.95)',
              transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Primary overlay with gradient */}
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.35) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.55) 100%)',
              }}
            />

            {/* Subtle color tint on hover */}
            <div
              className="absolute inset-0 transition-all duration-1000 ease-out"
              style={{
                background: 'linear-gradient(45deg, rgba(212,175,55,0.08) 0%, rgba(184,134,11,0.12) 100%)',
                opacity: isHovered ? 1 : 0,
              }}
            />

            {/* Vignette effect */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                opacity: isHovered ? 0.5 : 0.8,
                transition: 'opacity 0.7s ease-out',
              }}
            />
          </div>
        );
      })}

      {/* Subtle shine effect on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
      />

      {/* Progress indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="transition-all duration-500 ease-out"
            style={{
              width: index === currentIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index === currentIndex
                ? 'rgba(255,255,255,0.9)'
                : 'rgba(255,255,255,0.4)',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              boxShadow: index === currentIndex
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : 'none',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
