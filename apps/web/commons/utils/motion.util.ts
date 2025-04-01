export const slide = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: delay ?? 0 },
  }),
  exit: (delay?: number) => ({
    y: -100,
    opacity: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: delay ?? 0 },
  }),
};
