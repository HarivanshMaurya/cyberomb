import { useEffect, useRef } from 'react';

/**
 * Subtle animated background with floating orbs & soft gradient mesh.
 * Drop this at the top of any page for a modern, alive feel.
 * It renders behind content via absolute positioning.
 */
const PageBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Gentle parallax on mouse move (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      container.style.setProperty('--mx', `${x}px`);
      container.style.setProperty('--my', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden -z-10"
      style={{ '--mx': '0px', '--my': '0px' } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Soft gradient mesh */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px] transition-transform duration-[2000ms]"
        style={{ transform: 'translate(var(--mx), var(--my))' }}
      />
      <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-accent/[0.05] blur-[120px] transition-transform duration-[2500ms]"
        style={{ transform: 'translate(calc(var(--mx) * -0.6), calc(var(--my) * -0.6))' }}
      />
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-secondary/[0.04] blur-[100px]" />

      {/* Floating particles */}
      {[
        { size: 6, top: '12%', left: '8%', delay: '0s', dur: '18s' },
        { size: 4, top: '20%', left: '85%', delay: '2s', dur: '22s' },
        { size: 5, top: '35%', left: '15%', delay: '4s', dur: '20s' },
        { size: 3, top: '8%', left: '55%', delay: '1s', dur: '16s' },
        { size: 4, top: '28%', left: '70%', delay: '3s', dur: '24s' },
        { size: 5, top: '45%', left: '40%', delay: '5s', dur: '19s' },
        { size: 3, top: '15%', left: '35%', delay: '6s', dur: '21s' },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/[0.08] dark:bg-primary/[0.12]"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animation: `pageFloat ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Thin decorative lines */}
      <div className="absolute top-[18%] left-0 w-full h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      <div className="absolute top-[55%] left-0 w-full h-px bg-gradient-to-r from-transparent via-border/20 to-transparent" />
    </div>
  );
};

export default PageBackground;
