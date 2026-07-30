export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const viewSwap = {
  initial: { opacity: 0, scale: 0.985, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.01, filter: 'blur(6px)', transition: { duration: 0.35 } },
};

export const drawer = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } },
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } },
};

export const tabUnderline = { layout: true, transition: { type: 'spring', stiffness: 380, damping: 32 } };