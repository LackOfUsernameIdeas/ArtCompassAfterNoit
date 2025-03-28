import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const AnimatedValue = ({
  small = false,
  value,
  color
}: {
  small?: boolean;
  value: number;
  color: string;
}) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    animationRef.current = animate(count, value, {
      duration: 0.4,
      ease: "easeOut"
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [count, value]);

  return (
    <motion.span
      className="text-sm font-bold"
      style={{ color }}
      initial={{ scale: 1 }}
      animate={{
        scale: small ? [1, 1.05, 1] : [1, 1.15, 1],
        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
      }}
      transition={{
        duration: 0.4,
        times: [0, 0.2, 1],
        ease: "easeInOut"
      }}
    >
      {rounded}
    </motion.span>
  );
};

export default AnimatedValue;
