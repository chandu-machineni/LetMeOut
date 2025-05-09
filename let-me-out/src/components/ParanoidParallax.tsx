import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface ParanoidParallaxProps {
  children: React.ReactNode;
  chaosMultiplier?: number;
  disableAt?: number;
  maxTilt?: number;
}

const ParanoidParallax: React.FC<ParanoidParallaxProps> = ({
  children,
  chaosMultiplier = 1,
  disableAt = 0,
  maxTilt = 5,
}) => {
  const { chaosLevel } = useContext(AppContext);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse move to update parallax effect
  useEffect(() => {
    // Only enable if chaos level is sufficient
    if (chaosLevel * chaosMultiplier <= disableAt) {
      setIsActive(false);
      controls.start({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      return;
    }
    
    setIsActive(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as percentage of window
      const x = e.clientX / windowSize.width;
      const y = e.clientY / windowSize.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [chaosLevel, chaosMultiplier, disableAt, controls, windowSize]);
  
  // Apply parallax effect
  useEffect(() => {
    if (!isActive) return;
    
    // Calculate intensity based on chaos level
    const intensityFactor = Math.min((chaosLevel * chaosMultiplier - disableAt) / 5, 1);
    
    // Calculate parallax amounts
    const moveX = (mousePosition.x - 0.5) * 20 * intensityFactor;
    const moveY = (mousePosition.y - 0.5) * 20 * intensityFactor;
    
    // Calculate rotation amounts - more extreme at higher chaos levels
    const rotateY = (mousePosition.x - 0.5) * maxTilt * intensityFactor;
    const rotateX = (mousePosition.y - 0.5) * -maxTilt * intensityFactor;
    
    // Add occasional random movements at higher chaos levels
    const addRandomMovement = chaosLevel * chaosMultiplier >= 4 && Math.random() > 0.985;
    
    if (addRandomMovement) {
      // Add a sudden random movement
      const randomX = (Math.random() - 0.5) * 30;
      const randomY = (Math.random() - 0.5) * 30;
      const randomRotateX = (Math.random() - 0.5) * 10;
      const randomRotateY = (Math.random() - 0.5) * 10;
      
      controls.start({
        x: randomX,
        y: randomY,
        rotateX: randomRotateX,
        rotateY: randomRotateY,
        transition: { duration: 0.1 },
      }).then(() => {
        // Return to normal position
        controls.start({
          x: moveX,
          y: moveY,
          rotateX: rotateX,
          rotateY: rotateY,
          transition: { type: 'spring', damping: 10, stiffness: 100 },
        });
      });
    } else {
      // Normal parallax movement
      controls.start({
        x: moveX,
        y: moveY,
        rotateX: rotateX,
        rotateY: rotateY,
        transition: { 
          type: chaosLevel >= 4 ? 'tween' : 'spring',
          damping: 30 - (chaosLevel * 5),
          stiffness: 100,
        },
      });
    }
  }, [mousePosition, chaosLevel, isActive, maxTilt, controls, chaosMultiplier, disableAt]);
  
  // Add occasional screen shake at higher chaos levels
  useEffect(() => {
    if (chaosLevel * chaosMultiplier < 4) return;
    
    const shakeInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const intensity = (chaosLevel * chaosMultiplier - 3) * 0.5;
        
        // Quick sequence of shakes
        const performShake = async () => {
          for (let i = 0; i < 3; i++) {
            await controls.start({
              x: (Math.random() - 0.5) * 20 * intensity,
              y: (Math.random() - 0.5) * 20 * intensity,
              rotateX: (Math.random() - 0.5) * 5 * intensity,
              rotateY: (Math.random() - 0.5) * 5 * intensity,
              transition: { duration: 0.1 },
            });
          }
          
          // Return to mouse-based position
          controls.start({
            x: (mousePosition.x - 0.5) * 20,
            y: (mousePosition.y - 0.5) * 20,
            rotateX: (mousePosition.y - 0.5) * -maxTilt,
            rotateY: (mousePosition.x - 0.5) * maxTilt,
            transition: { type: 'spring', damping: 10, stiffness: 100 },
          });
        };
        
        performShake();
      }
    }, 10000 - chaosLevel * 1000);
    
    return () => clearInterval(shakeInterval);
  }, [chaosLevel, chaosMultiplier, controls, mousePosition, maxTilt]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        width: '100%',
        height: '100%',
      }}
    >
      <motion.div
        animate={controls}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
      
      {/* Add subtle vignette effect that intensifies with chaos level */}
      {chaosLevel * chaosMultiplier > 2 && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            boxShadow: `inset 0 0 ${30 + (chaosLevel * 10)}px rgba(0,0,0,${0.2 + (chaosLevel * chaosMultiplier - 2) * 0.1})`,
            zIndex: 30,
          }}
        />
      )}
      
      {/* Add subtle noise texture overlay at higher chaos levels */}
      {chaosLevel * chaosMultiplier > 3 && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: Math.min((chaosLevel * chaosMultiplier - 3) * 0.1, 0.2),
            mixBlendMode: 'overlay',
            zIndex: 31,
          }}
        />
      )}
    </div>
  );
};

export default ParanoidParallax; 