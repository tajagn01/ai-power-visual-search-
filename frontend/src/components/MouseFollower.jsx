import React, { useEffect, useRef, useState } from 'react';

const PARTICLE_LIFETIME = 900; // ms, longer fade
const PARTICLE_COUNT = 8; // fewer particles
const PARTICLE_SPAWN_INTERVAL = 32; // ms, slower spawn

const getRandom = (min, max) => Math.random() * (max - min) + min;

const MouseFollower = () => {
  const followerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const moveFollower = (e) => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      }
      // Only spawn a particle if enough time has passed
      const now = Date.now();
      if (now - lastSpawn.current > PARTICLE_SPAWN_INTERVAL) {
        lastSpawn.current = now;
        setParticles((prev) => [
          ...prev.slice(-PARTICLE_COUNT + 1),
          {
            id: Math.random().toString(36).substr(2, 9) + now,
            x: e.clientX + getRandom(-18, 18), // more separation
            y: e.clientY + getRandom(-18, 18),
            created: now,
            size: getRandom(4, 8), // smaller
          },
        ]);
      }
    };
    window.addEventListener('mousemove', moveFollower);
    return () => window.removeEventListener('mousemove', moveFollower);
  }, []);

  // Animate and remove old particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) => prev.filter(p => Date.now() - p.created < PARTICLE_LIFETIME));
    }, 40);
    return () => clearInterval(interval);
  }, [particles]);

  return (
    <>
      <div
        ref={followerRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(168,139,250,0.32) 60%, rgba(192,38,211,0.18) 100%)',
          boxShadow: '0 0 32px 10px #a78bfa55, 0 2px 24px 4px #c026d355, 0 0 0 2px rgba(255,255,255,0.12) inset',
          backdropFilter: 'blur(12px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
          border: '2px solid rgba(168, 139, 250, 0.55)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'transform 0.10s cubic-bezier(.4,2,.6,1), box-shadow 0.3s',
          mixBlendMode: 'lighten',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '18%',
            width: '64%',
            height: '64%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 80%)',
            pointerEvents: 'none',
            filter: 'blur(1.5px)',
          }}
        />
      </div>
      {particles.map((p) => {
        const age = Date.now() - p.created;
        const opacity = 0.7 - age / PARTICLE_LIFETIME * 0.7;
        const scale = 1 + age / PARTICLE_LIFETIME * 0.7;
        return (
          <div
            key={p.id}
            style={{
              position: 'fixed',
              left: p.x - p.size / 2,
              top: p.y - p.size / 2,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff 0%, #a78bfa 40%, #c026d3 90%, transparent 100%)',
              boxShadow: '0 0 8px 2px #a78bfa55, 0 0 16px 4px #c026d344',
              pointerEvents: 'none',
              zIndex: 9998,
              opacity,
              transform: `scale(${scale})`,
              transition: 'opacity 0.2s, transform 0.2s',
              filter: 'blur(0.5px)',
              mixBlendMode: 'lighten',
            }}
          />
        );
      })}
    </>
  );
};

export default MouseFollower; 