import { motion } from 'framer-motion';

const variants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.7, 0.01, 0.84, 0]
    }
  }
};

const PageTransition = ({ children }) => (
  <motion.div variants={variants} initial="initial" animate="animate" exit="exit" style={{ height: '100%' }}>
    {children}
  </motion.div>
);

export default PageTransition;
