import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function SwipeCarousel({ children, className = "" }: { children: ReactNode[]; className?: string }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });

  return (
    <div className={`overflow-hidden -mx-4 md:mx-0 ${className}`} ref={emblaRef}>
      <div className="flex gap-3 px-4 md:px-0">
        {children.map((child, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="min-w-[78%] sm:min-w-[48%] md:min-w-0 md:flex-1 shrink-0 md:shrink"
          >
            {child}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
