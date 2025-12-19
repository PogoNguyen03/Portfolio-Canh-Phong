"use client";
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Tăng damping để mượt hơn, giảm stiffness để bớt nặng CPU
  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Chỉ kích hoạt trên thiết bị có chuột
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.classList.add('custom-cursor-active');
    }

    const moveCursor = (e: MouseEvent) => {
      window.requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = !!target.closest('a, button, input, [role="button"]');
      setIsHovering(isClickable);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Vòng ngoài */}
      <motion.div
        className="fixed top-0 left-0 border border-blue-400 mix-blend-difference will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 60 : 32,
          height: isHovering ? 60 : 32,
          rotate: isHovering ? 90 : 0,
        }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-blue-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-blue-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-blue-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-blue-400" />
      </motion.div>

      {/* Tâm điểm */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="w-1 h-4 bg-blue-500 absolute" />
        <div className="w-4 h-1 bg-blue-500 absolute" />
      </motion.div>
    </div>
  );
}