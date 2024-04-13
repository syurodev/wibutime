export const slideWithScale = {
  initial: {
    y: "50",
    opacity: 0,
    scale: 1.1,
  },
  animate: (delay: number) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: delay },
  }),
  exit: (delay: number) => ({
    y: "-100",
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  }),
};
