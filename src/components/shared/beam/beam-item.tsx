import { motion, Transition } from 'framer-motion';

type BeamType = {
  top: number;
  left: number;
  transition?: Transition;
};

const BeamItem = ({ top, left, transition = {} }: BeamType) => {
  return (
    <motion.div
      initial={{
        y: 0,
        opacity: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        y: 32 * 8,
      }}
      transition={{
        ease: 'easeInOut',
        duration: 3,
        repeat: Infinity,
        repeatDelay: 1.5,
        ...transition,
      }}
      style={{
        top,
        left,
      }}
      className="absolute z-10 h-[64px] w-[1px] bg-gradient-to-b from-black/0 to-black"
    />
  );
};

export default BeamItem;
