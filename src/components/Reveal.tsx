"use client";

import { motion } from "framer-motion";

type Dir = "up" | "left" | "right" | "none";

const offset: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 32 },
  left: { x: -48 },
  right: { x: 48 },
  none: {},
};

export default function Reveal({
  children,
  dir = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  dir?: Dir;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(8px)", scale: 0.985, ...offset[dir] }}
      whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
