import type { Variants } from "motion/react";

export const premiumEase = [0.22, 1, 0.36, 1] as const;

export const viewportOnce = { once: true, amount: 0.18 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.72, ease: premiumEase } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.62, ease: premiumEase } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

export const cardHover = {
  y: -4,
  transition: { duration: 0.2, ease: premiumEase },
};

export const tapScale = {
  scale: 0.985,
  transition: { duration: 0.12, ease: premiumEase },
};
