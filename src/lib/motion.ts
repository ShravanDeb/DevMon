export const ease: readonly [number, number, number, number] = [0.16, 1, 0.3, 1];

export const entrance = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
} as const;

export const gesture = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const press = {
  duration: 0.15,
  ease: [0.16, 1, 0.3, 1],
} as const;

export const stagger = {
  fast: { staggerChildren: 0.06 },
  normal: { staggerChildren: 0.08 },
} as const;

export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: entrance },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
  pageEnter: {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: entrance },
    exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
  },
};
