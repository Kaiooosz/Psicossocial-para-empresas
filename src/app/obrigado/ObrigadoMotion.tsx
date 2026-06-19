"use client";

import { motion } from "framer-motion";

export function BackgroundMotion() {
  return (
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url(/hero.jpg)" }}
      initial={{ scale: 1.08 }}
      animate={{ scale: 1.18 }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

export function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
