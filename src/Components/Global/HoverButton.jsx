import { motion, useMotionValue } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

const HoverButton = ({ color, title }) => {
  const [Hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!Hovered || !btnRef.current) return;

    const handleMouseMove = (e) => {
      const rect = btnRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;

      x.set(localX);
      y.set(localY);
    };

    if (Hovered) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [Hovered]);

  return (
    <motion.button
      ref={btnRef}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
      animate={{
        color: Hovered ? "#fff" : color,
      }}
      style={{
        borderColor: color,
        color
      }}
      className="text-[12px] h-[30px] rounded-[5px] w-[133px] border cursor-pointer relative overflow-hidden"
    >
      <span className="z-[10] w-full relative">{title}</span>
      <motion.div
        animate={{
          width: Hovered ? "300px" : 0,
          height: Hovered ? "300px" : 0,
          transition: { duration: 0.5 },
        }}
        style={{
          x,
          y,
          background: color,
        }}
        className="absolute -translate-1/2 rounded-full z-[0]"
      />
    </motion.button>
  );
};

export default HoverButton;
