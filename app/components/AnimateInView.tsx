"use client";

import { useRef, useEffect, useState } from "react";
import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimateInViewProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  /** Animation variant: fade, slide-up, slide-left, slide-right */
  variant?: "fade" | "slide-up" | "slide-left" | "slide-right";
  /** Delay in seconds */
  delay?: number;
  /** Threshold for intersection */
  threshold?: number;
}

const VARIANTS: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

/**
 * Wraps children in a Framer Motion div that animates when it enters the viewport.
 */
export default function AnimateInView({
  children,
  className,
  variant = "slide-up",
  delay = 0,
  threshold = 0.15,
  ...rest
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      variants={VARIANTS[variant]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
