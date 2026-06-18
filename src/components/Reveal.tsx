"use client";

import { motion } from "framer-motion";

type Dir = "up" | "left" | "right";

const offset: Record<Dir, { x?: number; y?: number }> = {
  up: { y: 28 },
  left: { x: -48 },
  right: { x: 48 },
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
      initial={{ opacity: 0, ...offset[dir] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
