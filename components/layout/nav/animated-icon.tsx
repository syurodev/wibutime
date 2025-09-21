"use client";

import { getIcon, IconName } from "@/lib/icons";
import { AnimatePresence, motion, Variants } from "framer-motion";

const iconTransitionVariants: Variants = {
    initial: {
        opacity: 0,
        filter: "blur(4px)",
        scale: 0.8,
        rotate: -10,
    },
    animate: {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        filter: "blur(4px)",
        scale: 0.8,
        rotate: 10,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

interface AnimatedIconProps {
    icon: IconName;
    className?: string;
    size?: number;
}

export default function AnimatedIcon({
    icon,
    className = "",
    size = 20,
}: AnimatedIconProps) {
    const Icon = getIcon(icon);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={icon} // Key changes trigger exit/enter animations
                variants={iconTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: `${size}px`,
                    height: `${size}px`,
                    lineHeight: 1,
                }}
            >
                <Icon className={className} size={size} />
            </motion.div>
        </AnimatePresence>
    );
}
